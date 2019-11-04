import {Injectable} from "@nestjs/common";
import {Transaction, TransactionRepository} from "typeorm";
import {UserRepository} from "../users/user.repository";
import {GameObserver, GameStorage, Room} from "./game.storage";
import {GameDto, GameStatuses} from "./dto/game.dto";
import {CardRepository} from "../cards/repositories/card.repository";
import {WsException} from "@nestjs/websockets";
import config from "../config";
import {GameScheduler} from "./game.scheduler";
import {Card} from "../cards/card.entity";
import {DiceGame, RouletteGame} from "./games";
import {UserActionType} from "./game.socket";


@Injectable()
export class GameService extends GameObserver{
    constructor(
        private readonly gameStorage: GameStorage,
        private readonly gameScheduler: GameScheduler
    ) {
        super();
        this.gameStorage.onGameStatusChanged(async (roomId, status) => {
            switch (status) {
                case GameStatuses.started:
                    this.onGameStarted(roomId);
                    this.emitGameStatusChanged(roomId, status);
                    break;
                case GameStatuses.ended:
                    const result = await this.onGameEnded(roomId);
                    this.emitGameStatusChanged(roomId, status, result);
                    break;
                case GameStatuses.canceled:
                    await this.onGameCanceled(roomId);
                    this.emitGameStatusChanged(roomId, status);
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

    async onGameCanceled(roomId) {
        await this.cancelGame(roomId)
    }

    @Transaction()
    async onGameEnded(roomId,
                      @TransactionRepository(CardRepository) cardRep?: CardRepository,
                      @TransactionRepository(UserRepository) userRep?: UserRepository
    ) {
        const room = this.gameStorage.getRoom(roomId);
        const game = room.gameInstance;
        if(game instanceof DiceGame){
            return;
        }
        if(game instanceof RouletteGame){
            const winnerId = game.winner;
            const allCards = Object.keys(room.cards).reduce((cards, userId) => {
                return [...cards, ...room.cards[userId]]
            }, []);
            const winner = await userRep.findById(winnerId);
            const cardsForWinner = await Promise.all(allCards.map((card: Card)=>{
                card.user = winner;
                return cardRep.save(card)
            }))
            return {
                winner: winnerId,
                cards: cardsForWinner
            }
        }
    }
    createRoom(game: GameDto) {
        const roomId = this.gameStorage.createRoom(game)
        this.gameScheduler.addTask(() => {
            const room = this.gameStorage.getRoom(roomId);
            if(room.game.gameStatus == GameStatuses.started) return;
            if (room.users.length < config.minUserInRoom) this.gameStorage.cancelGame(roomId);
            else this.startGame(roomId)
        }, config.waitingRoomTime)
        this.emitGameStatusChanged(roomId, GameStatuses.waiting);
        return roomId;
    }

    @Transaction()
    async addUserToRoom(roomId: number, userId: number, cardsForBet: number[],
                        @TransactionRepository(CardRepository) cardRep?: CardRepository,
                        @TransactionRepository(UserRepository) userRep?: UserRepository) {
            this.canAddUserToRoom(roomId);
            const user = await userRep.findById(userId);
            const financier = await userRep.findByLogin(config.financier.login);
            if (!financier) throw new WsException("Please, make sure that all deploy migrations applied");
            const cards = await cardRep.getCards(cardsForBet);
            const room = this.gameStorage.getRoom(roomId);
            this.checkUsersCardBeforeAdding(room, cards);
            this.gameStorage.addUserToRoom(roomId, user, cards);
            await cardRep.transferCards(cardsForBet, user, financier);
            if(room.users.length == config.maxUsersInRoom) this.startGame(roomId);
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
        return await Promise.all(Object.keys(roomCards).map(async userId => {
            const cards: Card[] = roomCards[userId];
            return Promise.all(cards.map(async card => {
                card.user = await userRep.findById(Number(userId))
                return await cardRep.save(card);
            }))
        }))
    }
    @Transaction()
    async rollDice(roomId: number, userId: number,
                   @TransactionRepository(CardRepository) cardRep?: CardRepository,
                   @TransactionRepository(UserRepository) userRep?: UserRepository
    ) {
        const room = this.gameStorage.getRoom(roomId);
        const game = room.gameInstance as DiceGame;
        if(room.game.gameStatus != GameStatuses.started) throw new WsException('Game is not active');
        if(game.currentPlayer != userId) throw new WsException('Not your turn');
        const result = game.makeRoll();
        const user = await userRep.findById(userId);
        let cards = [];
        if(result.length != 0){
            const financier = await userRep.findByLogin(config.financier.login);
            cards =  await cardRep.transferCards(result, financier, user);
        }
        game.nextPlayer();
        return cards;
    }

    async userAction(userId: number, roomId: number, actionType: UserActionType, payload?: any){
        switch (actionType) {
            case UserActionType.rollDice:
                return await this.rollDice(roomId, userId);
        }
    }

}