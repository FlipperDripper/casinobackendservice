import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody, WsException
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {Req, UseGuards, UsePipes, ValidationPipe} from "@nestjs/common";
import {JwtAuthGuard} from "../auth/jwtAuth.guard";
import {GameDto, GameStatuses} from "./dto/game.dto";
import {JwtAuthSocketGuard} from "../auth/JwtAuthSocket.guard";
import {GameService} from "./game.service";
import {EnterToRoomDto} from "./dto/enterToRoom.dto";
import {GameStorage} from "./game.storage";


@UseGuards(JwtAuthSocketGuard)
@WebSocketGateway()
export class GameSocket implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server:Server;
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

    onGameStarted(roomId){
        this.server.to(roomId.toString()).emit('@game:started')
    }
    onGameEnded(roomId){
        this.server.to(roomId.toString()).emit('@game:end')
    }
    onGameCanceled(roomId){
        this.server.to(roomId.toString()).emit('@game:canceled')
    }
    handleConnection(client:Socket): any {
        console.log('connection')
    }
    handleDisconnect(client: Socket): any {
    }
    @SubscribeMessage('@room:create')
    createRoom(client, data: GameDto) {
        if(!(data && data.maxCards && data.maxCardValue && data.maxSumValue && data.minCards && data.minCardValue && data.minSumValue))
            throw new WsException("Send all required arguments!");
        const roomId = this.gameService.createRoom({...data});
        return {status: 'ok', roomId}
    }

    @SubscribeMessage('@room:enter')
    async enterToRoom(client, data: EnterToRoomDto){
        const {id, login} = client.authData;
        if(!data.roomId || !data.cards) throw new WsException("Send roomId and cards!");
        await this.gameService.addUserToRoom(data.roomId, id, data.cards)
        this.roomConnected(data.roomId, id);
        client.join(data.roomId.toString());
        return {status: 'ok'}
    }

    @SubscribeMessage('@room:exit')
    async roomExit(client, data:{roomId: number}){
        const {id, login} = client.authData;
        if(!data.roomId) throw new WsException("Send roomId!");
        this.gameService.removeUserFromRoom(id, data.roomId);
        this.roomDisconnected(data.roomId, id);
        client.leave(data.roomId.toString());
        return {status: 'ok'}
    }

    @SubscribeMessage('@game:bet')
    makeBet(message: {bet: number}, client ){
        const {id, login} = client.authData;
        Object.keys(client.rooms).map(room=>{
            console.log(room)
        })
    }

    @SubscribeMessage('@game:roll')
    rollDice(message, client){
        const {id, login} = client.authData;
    }

    roomConnected(roomId: number, userId: number){
        this.server.emit('@room:connected', {status:'ok', roomId, userId});
    }
    roomDisconnected(roomId: number, userId: number){
        this.server.emit('@room:disconnected', {status:'ok', roomId, userId});
    }


}