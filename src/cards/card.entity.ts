import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Pack} from "./pack.entity";
import {Item} from "./item.entity";
import {User} from "../users/users.entity";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'pack_id'})
    packId: number;

    @Column({name: 'item_id'})
    itemId: number;

    @Column({name: 'user_id'})
    userId: number;

    @ManyToOne(type => Pack, pack => pack.cards)
    @JoinColumn({name: 'pack_id'})
    pack: Pack;

    @ManyToOne(type => Item, item => item.cards)
    @JoinColumn({name: 'item_id'})
    item: Item;

    @ManyToOne(type => User, user => user.cards)
    @JoinColumn({name: 'user_id'})
    user: User;
}