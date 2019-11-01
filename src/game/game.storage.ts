import {Injectable} from "@nestjs/common";
import {User} from "../users/users.entity";
import {GameDto, GameStatuses, GameType} from "./dto/game.dto";
import {Card} from "../cards/card.entity";
import {DiceGame, RouletteGame} from "./games";
import config from "../config";

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

@Injectable()
export class GameStorage {
    private _storage: {
        lastId: number,
        rooms: { [roomId: number]: Room },
    } = {
        lastId: 0,
        rooms: {}
    }
    private gameStatusSwitchCallbacks: Array<(roomId: number, status: GameStatuses) => void> = [];

    onGameStatusChanged(callback: (roomId: number, status: GameStatuses) => void) {
        this.gameStatusSwitchCallbacks.push(callback);
    }

    emitGameStatusChanged(roomId, status: GameStatuses) {
        this.gameStatusSwitchCallbacks.forEach(cb => {
            cb(roomId, status)
        })
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
        console.log(store)
        let gameInstance;
        if (game.gameType == GameType.roulette) gameInstance = new RouletteGame();
        else gameInstance = new DiceGame(config.countOfCubes, config.maxCubeValue);
        store.rooms[roomId] = {game, users, cards, currentActiveUser: null, gameInstance, id:roomId};
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
        this.storage = store;
    }

    removeUserFromRoom(roomId: number, userId: number) {
        const store = this.storage;
        store.rooms[roomId].users = store.rooms[roomId].users.filter(user => user.id != userId);
        this.storage = store;
    }

    startGame(roomId: number) {
        const store = this.storage;
        store.rooms[roomId].game.gameStatus = GameStatuses.started;
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