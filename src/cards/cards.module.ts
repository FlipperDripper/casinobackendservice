import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Pack} from "./pack.entity";
import {Card} from "./card.entity";
import {Item} from "./item.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([Pack, Card, Item]),
    ]
})
export class CardsModule {}
