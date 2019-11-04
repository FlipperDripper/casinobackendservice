import {Injectable} from "@nestjs/common";
import {User} from "../users/users.entity";
import {GameDto, GameStatuses, GameType} from "./dto/game.dto";
import {Card} from "../cards/card.entity";
import {DiceGame, RouletteGame} from "./games";

export class Room {
    id: number;
    game: GameDto;
    users: User[];
    currentActiveUser: User | null;
    cards: {
        [userId: number]: Card[]
    };
    gameInstance: RouletteGame | DiceGame;
}
export class GameObserver {
    private gameStatusSwitchCallbacks: Array<(roomId: number, status: GameStatuses, payload?:any) => void> = [];
    onGameStatusChanged(callback: (roomId: number, status: GameStatuses, payload?:any) => void) {
        this.gameStatusSwitchCallbacks.push(callback);
    }

    emitGameStatusChanged(roomId, status: GameStatuses, payload?: any) {
        this.gameStatusSwitchCallbacks.forEach(cb => {
            cb(roomId, status, payload)
        })
    }
}
@Injectable()
export class GameStorage extends GameObserver{
    private _storage: {
        lastId: number,
        rooms: { [roomId: number]: Room },
    } = {
        lastId: 0,
        rooms: {}
    }

    get storage() {
        return {...this._storage};
    }

    set storage(storage) {
        this._storage = storage;
    }

    createRoom(game: GameDto, users: User[] = [], cards: { [userId: number]: Card[] } = {}) {
        const store = this.storage;
        store.lastId++;
        const roomId = store.lastId;
        let gameInstance;
        if (game.gameType == GameType.roulette)
            gameInstance = new RouletteGame();
        else
            gameInstance = new DiceGame();
        store.rooms[roomId] = {game:{...game, gameStatus: GameStatuses.waiting}, users, cards, currentActiveUser: null, gameInstance, id: roomId};
        this.storage = store;
        return roomId;
    }

    getRoom(roomId: number) {
        return this.storage.rooms[roomId];
    }

    addUserToRoom(roomId: number, user: User, cardsForBet: Card[]) {
        const store = this.storage;
        const room = store.rooms[roomId];
        room.users.push(user);
        room.cards = {
            ...room.cards,
            [user.id]: cardsForBet
        };
        room.gameInstance.addPlayer(user.id, cardsForBet.map(card=>card.id));
        this.storage = store;
    }

    removeUserFromRoom(roomId: number, userId: number) {
        const store = this.storage;
        store.rooms[roomId].users = store.rooms[roomId].users.filter(user => user.id != userId);
        store.rooms[roomId].gameInstance.removePlayer(userId);
        this.storage = store;
    }

    startGame(roomId: number) {
        const store = this.storage;
        const room = store.rooms[roomId];
        room.game.gameStatus = GameStatuses.started;
        room.gameInstance.onEndGame(()=>{
            this.endGame(roomId)
        });
        room.gameInstance.startGame();
        this.emitGameStatusChanged(roomId, GameStatuses.started);
        this.storage = store;
    }

    endGame(roomId: number) {
        const store = this.storage;
        store.rooms[roomId].game.gameStatus = GameStatuses.ended;
        this.emitGameStatusChanged(roomId, GameStatuses.ended);
        this.storage = store;
    }

    cancelGame(roomId: number) {
        const store = this.storage;
        store.rooms[roomId].game.gameStatus = GameStatuses.canceled;
        this.emitGameStatusChanged(roomId, GameStatuses.canceled);
        this.storage = store;
    }
}