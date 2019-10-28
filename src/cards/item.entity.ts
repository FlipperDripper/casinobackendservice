import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Pack} from "./pack.entity";
import {Card} from "./card.entity";

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50})
    name: string;

    @Column({type: "decimal"})
    value: number;

    @ManyToOne(type => Pack, pack => pack.items)
    @JoinColumn({name:"pack_id"})
    pack: Pack;

    @OneToMany(type => Card, card => card.item)
    cards: Card[];
}