import {Entity, Column, PrimaryGeneratedColumn, Unique, CreateDateColumn, BeforeInsert, OneToMany} from 'typeorm';
import * as bcrypt from 'bcryptjs'
import {BalanceOperationEntity} from "../finance/balanceOperaton.entity";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50 , name: 'first_name'})
    firstName: string;

    @Column({ length: 50, name: 'last_name'})
    lastName: string;

    @Column({unique: true})
    login: string;

    @Column()
    password: string

    @Column({type: 'decimal', default: 0})
    balance: number

    @CreateDateColumn({name:'created_at'})
    createdAt: string

    @OneToMany(type => BalanceOperationEntity, operation=>operation.user)
    operations: BalanceOperationEntity[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 12);
    }
}