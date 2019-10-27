import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Pack} from "./pack.entity";
import {Item} from "./item.entity";
import {User} from "../users/users.entity";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(type => Pack, pack => pack.cards)
    pack: Pack

    @ManyToOne(type => Item, item => item.cards)
    item: Item

    @ManyToOne(type => User, user => user.cards)
    user: User
}