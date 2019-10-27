import {Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, BeforeInsert, ManyToOne} from 'typeorm';
import {User} from "../users/users.entity";

export enum BalanceOperationType {
    deposit = 'deposit',
    withdraw = 'withdraw'
}

@Entity()
export class BalanceOperationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        name: 'type',
        enum: BalanceOperationType,
        nullable: false})
    type: BalanceOperationType;

    @Column({type:'decimal'})
    value: number

    @ManyToOne(type => User, user=>user.operations)
    user: User

    @CreateDateColumn({name: 'created_at'})
    createdAt: string
}