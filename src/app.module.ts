import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import * as config from "./ormconfig";
import {AuthService} from "./auth/auth.service";
import {APP_GUARD} from "@nestjs/core";
import {LocalAuthGuard} from "./auth/localAuth.guard";
import { FinanceModule } from './finance/finance.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [
      UsersModule,
      TypeOrmModule.forRoot(config),
      AuthModule,
      FinanceModule,
      CardsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
