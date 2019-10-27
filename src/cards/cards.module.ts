import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Pack} from "./pack.entity";
import {Card} from "./card.entity";
import {Item} from "./item.entity";
import {CardsService} from "./cards.service";
import {CardsController} from "./cards.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([Pack, Card, Item]),
    ],
    providers:[
        CardsService
    ],
    controllers: [CardsController]
})
export class CardsModule {}
