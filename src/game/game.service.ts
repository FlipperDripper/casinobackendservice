import {Injectable} from "@nestjs/common";
import {Transaction, TransactionRepository} from "typeorm";
import {UserRepository} from "../users/user.repository";
import {GameStorage, Room} from "./game.storage";
import {GameDto, GameStatuses} from "./dto/game.dto";
import {CardRepository} from "../cards/repositories/card.repository";
import {WsException} from "@nestjs/websockets";
import config from "../config";
import {GameScheduler} from "./game.scheduler";
import {Card} from "../cards/card.entity";
import {DiceGame, RouletteGame} from "./games";


@Injectable()
export class GameService {
    constructor(
        private readonly gameStorage: GameStorage,
        private readonly gameScheduler: GameScheduler
    ) {
        this.gameStorage.onGameStatusChanged((roomId, status) => {
            switch (status) {
                case GameStatuses.waiting:
                    break;
                case GameStatuses.started:
                    this.onGameStarted(roomId)
                    break;
                case GameStatuses.ended:
                    this.onGameCanceled(roomId)
                    break;
                case GameStatuses.canceled:
                    break;
            }
        })
    }

    onGameStarted(roomId) {
        const room = this.gameStorage.getRoom(roomId);
        const gameType = room.gameInstance instanceof RouletteGame ? RouletteGame : DiceGame;
        if (gameType == RouletteGame) {
        }
        if (gameType == DiceGame) {
        }
    }

    onGameCanceled(roomId) {
    }
    @Transaction()
    async onGameEnded(roomId, @TransactionRepository(CardRepository) cardRep?: CardRepository) {
        // const room = this.gameStorage.getRoom(roomId);
        // const gameType = room.gameInstance instanceof RouletteGame ? RouletteGame : DiceGame;
        // if (gameType == RouletteGame) {
        //     const game = room.gameInstance as RouletteGame;
        //     const winners = game.getWinners();
        //     const allCards = Object.keys(room.cards).reduce((cards, userId)=>{
        //         return [...cards, ...room.cards[userId]]
        //     },[])
        //
        //     const cardsForOne = Math.floor(allCards.length/winners.length);
        //     return await Promise.all(winners.map(userId=> {
        //             const user = room.users.filter(user => user.id == userId)[0];
        //             for(let i = 0; i<cardsForOne; i++){
        //                 const card = allCards.pop() as Card;
        //                 card.user = user;
        //                 return cardRep.save(card);
        //             }
        //         }
        //     ));
        //
        // }
        // if (gameType == DiceGame) {
        // }
        //
    }


    createRoom(game: GameDto) {
        game.gameStatus = GameStatuses.waiting;
        console.log('gameCanceled')
        const roomId = this.gameStorage.createRoom(game)
        this.gameScheduler.addTask(() => {
            const room = this.gameStorage.getRoom(roomId);
            if (room.users.length < config.minUserInRoom) {
                this.cancelGame(roomId)
                    .then(() => {
                        console.log('canceled')
                    })
                    .catch(console.log)
            } else this.startGame(roomId)
        }, config.waitingRoomTime)
        return roomId;
    }

    @Transaction()
    async addUserToRoom(roomId: number, userId: number, cardsForBet: number[],
                        @TransactionRepository(CardRepository) cardRep?: CardRepository,
                        @TransactionRepository(UserRepository) userRep?: UserRepository) {
        try {
            this.canAddUserToRoom(roomId);
            const user = await userRep.findById(userId);
            const financier = await userRep.findByLogin(config.financier.login);
            if (!financier) throw new WsException("Please, make sure that all deploy migrations applied");
            const cards = await cardRep.getCards(cardsForBet);
            const room = this.gameStorage.getRoom(roomId);
            this.checkUsersCardBeforeAdding(room, cards);
            this.gameStorage.addUserToRoom(roomId, user, cards);
            await cardRep.transferCards(cardsForBet, user, financier);
        } catch (e) {
            throw new WsException(e);
        }
    }

    canAddUserToRoom(roomId: number) {
        const room = this.gameStorage.getRoom(roomId);
        if (!room) throw new WsException("Room with same id is not found");
        if (room.users.length >= config.maxUsersInRoom) throw new WsException("The room is full");
        if (room.game.gameStatus != GameStatuses.waiting) throw new WsException("The game is not waiting for users")
    }

    checkUsersCardBeforeAdding(room: Room, cardsForBet: Card[]) {
        const game = room.game;
        const cardsCount = cardsForBet.length;
        if (cardsCount < game.minCards) throw new WsException('Game need more cards');
        if (cardsCount > game.minCards) throw new WsException('Game need less cards');
        const cardsValueSum = cardsForBet.reduce((sum, card) => {
            return sum + card.item.value;
        }, 0);
        if (cardsValueSum > game.maxSumValue) throw new WsException('Cards sum more than limit of room');
        if (cardsValueSum < game.minCardValue) throw new WsException('Cards sum less than limit of room');
        // check some card more or less than game limitations
        const moreOrLess = cardsForBet.some((card) => {
            return card.item.value > game.maxCardValue || card.item.value < game.minCardValue;
        })
        if (moreOrLess) throw new WsException('Some cards more or less than limit of room');
        return true;
    }

    startGame(roomId: number) {
        this.gameStorage.startGame(roomId)
    }

    removeUserFromRoom(userId: number, roomId: number) {
        this.gameStorage.removeUserFromRoom(roomId, userId);
    }

    @Transaction()
    async cancelGame(roomId: number,
                     @TransactionRepository(UserRepository) userRep?: UserRepository,
                     @TransactionRepository(CardRepository) cardRep?: CardRepository) {
        const room = this.gameStorage.getRoom(roomId);
        const roomCards = room.cards;
        this.gameStorage.cancelGame(roomId);
        return await Promise.all(Object.keys(roomCards).map(async userId => {
            const cards: Card[] = roomCards[userId];
            return Promise.all(cards.map(async card => {
                card.user = await userRep.findById(Number(userId))
                return await cardRep.save(card);
            }))
        }))
    }
    makeBet(roomId: number, bet: number, userId: number){
        const room = this.gameStorage.getRoom(roomId);
        const game = room.gameInstance as RouletteGame;
        game.makeBet(bet, userId);
        const usersIds = room.users.map(user=>user.id);
        const usersWithBet = Object.keys(game.bets);
        if(usersIds.length == usersWithBet.length && (new Set(usersIds)).size == usersIds.length){
            game.getResult()
            this.gameStorage.endGame(roomId);
        }
        return room;
    }

}