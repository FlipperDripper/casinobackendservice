import {Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, BeforeInsert, OneToMany} from 'typeorm';
import * as bcrypt from 'bcryptjs'
import {BalanceOperation} from "../finance/balanceOperaton.entity";
import {Card} from "../cards/card.entity";
import {Exclude} from "class-transformer";

export enum UserRoles {
    client = 'client',
    admin = 'admin',
    financier = 'financier'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 50, name: 'first_name'})
    firstName: string;

    @Column({length: 50, name: 'last_name'})
    lastName: string;

    @Column({unique: true})
    login: string;

    @Exclude()
    @Column()
    password: string

    @Column({type: 'decimal', default: 0})
    balance: number

    @Column({type: "enum", enum: UserRoles, default: UserRoles.client})
    role: UserRoles

    @CreateDateColumn({name: 'created_at'})
    createdAt: string

    @OneToMany(type => BalanceOperation, operation => operation.user)
    operations: BalanceOperation[]

    @OneToMany(type => Card, card => card.user)
    cards: Card[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }
}