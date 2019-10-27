import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Item} from "./item.entity";
import {Card} from "./card.entity";

@Entity()
export class Pack {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    name: string;

    @Column({type: "decimal"})
    price: number;

    @OneToMany(type => Item, item => item.pack)
    items: Item[];

    @OneToMany(type => Card, card => card.pack)
    cards: Item[];
}