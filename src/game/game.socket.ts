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


export enum UserActionType {
    rollDice = 'roll_dice'
}

@UseGuards(JwtAuthSocketGuard)
@WebSocketGateway()
export class GameSocket implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly gameService: GameService,
        private readonly gameStorage: GameStorage
    ) {
        this.gameService.onGameStatusChanged((roomId, status, payload) => {
            switch (status) {
                case GameStatuses.waiting:
                    break;
                case GameStatuses.started:
                    this.onGameStarted(roomId);
                    break;
                case GameStatuses.ended:
                    this.onGameEnded(roomId, payload);
                    break;
                case GameStatuses.canceled:
                    this.onGameCanceled(roomId);
                    break;
            }
        })
    }
    onGameStarted(roomId) {
        this.server.to(roomId.toString()).emit('@game:started')
        const room = this.gameStorage.getRoom(roomId);
        if(room.gameInstance instanceof DiceGame){
            this.emitCurrentUser(room.gameInstance.currentPlayer, roomId);
        }
    }

    onGameEnded(roomId, payload: any) {
        this.server.to(roomId.toString()).emit('@game:end', {payload: payload || {}})
    }

    onGameCanceled(roomId) {
        this.server.to(roomId.toString()).emit('@game:canceled')
    }

    @SubscribeMessage('@room:create')
    createRoom(client, data: GameDto) {
        try {
            if (!(data && data.maxCards && data.maxCardValue && data.maxSumValue && data.minCards && data.minCardValue && data.minSumValue))
                throw new WsException("Send all required arguments!");
            const roomId = this.gameService.createRoom({...data});
            return {status: 'ok', roomId}
        } catch (e) {
            console.log(e);
        }
    }

    @SubscribeMessage('@room:enter')
    async enterToRoom(client, data: EnterToRoomDto) {
        try {
            const {id} = client.authData;
            if (!data.roomId || !data.cards) throw new WsException("Send roomId and cards!");
            await this.gameService.addUserToRoom(data.roomId, id, data.cards);
            client.join(data.roomId.toString());
            this.roomConnected(data.roomId, id);
            return {status: 'ok'}
        } catch (e) {
            throw new WsException(e.message)
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

    @SubscribeMessage('@game:user_action')
    async userAction(client, message: { roomId: number, action: UserActionType }) {
        try {
            const {id, login} = client.authData;
            const room = this.gameStorage.getRoom(message.roomId);
            const result = await this.gameService.userAction(id, message.roomId, message.action);
            this.emitUserAction(id, room, result)
        }catch(e){
            console.log(e);
        }
    }

    roomConnected(roomId: number, userId: number) {
        this.server.emit('@room:connected', {status: 'ok', roomId, userId});
    }

    roomDisconnected(roomId: number, userId: number) {
        this.server.emit('@room:disconnected', {status: 'ok', roomId, userId});
    }

    emitUserAction(userId: number, room: Room, data) {
        this.server.to(room.id.toString()).emit('@game:user_action', {userId, data});
    }

    emitCurrentUser(userId: number, roomId: number) {
        this.server.to(roomId.toString()).emit('@game:current_user', {userId, roomId})
    }

    handleConnection(): any {
    }

    handleDisconnect(): any {
    }
}