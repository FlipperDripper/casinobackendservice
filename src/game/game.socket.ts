import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {UseGuards} from "@nestjs/common";
import {GameDto, GameStatuses} from "./dto/game.dto";
import {JwtAuthSocketGuard} from "../auth/JwtAuthSocket.guard";
import {GameService} from "./game.service";
import {EnterToRoomDto} from "./dto/enterToRoom.dto";
import {GameStorage, Room} from "./game.storage";
import {DiceGame, RouletteGame} from "./games";


@UseGuards(JwtAuthSocketGuard)
@WebSocketGateway()
export class GameSocket implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly gameStorage: GameStorage
    ) {
        this.gameStorage.onGameStatusChanged((roomId, status) => {
            switch (status) {
                case GameStatuses.started:
                    this.onGameStarted(roomId);
                    break
                case GameStatuses.ended:
                    this.onGameEnded(roomId);
                    break;
                case GameStatuses.canceled:
                    this.onGameCanceled(roomId);
                    break;
            }
        })
    }

    onGameStarted(roomId) {
        this.server.to(roomId.toString()).emit('@game:started')
    }

    onGameEnded(roomId) {
        const room = this.gameStorage.getRoom(roomId);
        this.server.to(roomId.toString()).emit('@game:end', room.gameInstance)
    }

    onGameCanceled(roomId) {
        this.server.to(roomId.toString()).emit('@game:canceled')
    }

    handleConnection(client: Socket): any {
        console.log('connection')
    }

    handleDisconnect(client: Socket): any {
    }

    @SubscribeMessage('@room:create')
    createRoom(client, data: GameDto) {
        if (!(data && data.maxCards && data.maxCardValue && data.maxSumValue && data.minCards && data.minCardValue && data.minSumValue))
            throw new WsException("Send all required arguments!");
        const roomId = this.gameService.createRoom({...data});
        return {status: 'ok', roomId}
    }

    @SubscribeMessage('@room:enter')
    async enterToRoom(client, data: EnterToRoomDto) {
        try {
            const {id, login} = client.authData;
            if (!data.roomId || !data.cards) throw new WsException("Send roomId and cards!");
            await this.gameService.addUserToRoom(data.roomId, id, data.cards)
            this.roomConnected(data.roomId, id);
            client.join(data.roomId.toString());
            this.initUserInGame(data.roomId, id);
            return {status: 'ok'}
        } catch (e) {
            console.log(e)
        }
    }

    initUserInGame(roomId: number, userId: number) {
        const room = this.gameStorage.getRoom(roomId);
        const game = room.gameInstance;
        if (game instanceof RouletteGame) {
        }
        if (game instanceof DiceGame) {
            game.addUser(userId);
        }
    }

    @SubscribeMessage('@room:exit')
    async roomExit(client, data: { roomId: number }) {
        const {id, login} = client.authData;
        if (!data.roomId) throw new WsException("Send roomId!");
        this.gameService.removeUserFromRoom(id, data.roomId);
        this.roomDisconnected(data.roomId, id);
        client.leave(data.roomId.toString());
        return {status: 'ok'}
    }

    @SubscribeMessage('@game:bet')
    makeBet(client, message: { roomId: number, bet: number }) {
        const {id, login} = client.authData;
        let room = this.gameStorage.getRoom(message.roomId);
        if (room.game.gameStatus != GameStatuses.started) {
            throw new WsException("Game is not active");
        }
        room = this.gameService.makeBet(message.roomId, message.bet, id);
        this.userAction(id, room, {bet: message.bet});
    }

    @SubscribeMessage('@game:roll')
    rollDice(message: { roomId: number }, client) {
        const {id, login} = client.authData;
        const cubes = this.gameService.rollDice(message.roomId, id);
        const room = this.gameStorage.getRoom(message.roomId);
        this.userAction(id, room, {cubes})
    }

    roomConnected(roomId: number, userId: number) {
        this.server.emit('@room:connected', {status: 'ok', roomId, userId});
    }

    roomDisconnected(roomId: number, userId: number) {
        this.server.emit('@room:disconnected', {status: 'ok', roomId, userId});
    }

    userAction(userId: number, room: Room, data) {
        this.server.to(room.id.toString()).emit('@game:user_action', {userId, data});
    }


}