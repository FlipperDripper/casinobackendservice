import { Module } from '@nestjs/common';
import {GameSocket} from "./game.socket";
import {GameStorage} from "./game.storage";
import {UsersModule} from "../users/users.module";
import {CardsModule} from "../cards/cards.module";
import {GameService} from "./game.service";
import {GameScheduler} from "./game.scheduler";

@Module({
    imports: [UsersModule, CardsModule],
    providers:[GameSocket, GameStorage, GameService, GameScheduler],
    exports: [GameSocket]
})
export class GameModule {}
