import {EntityRepository, Repository} from "typeorm";
import {Card} from "../card.entity";
import {CardDto} from "../dto/card.dto";
import {Pack} from "../pack.entity";
import {Item} from "../item.entity";
import {User} from "../../users/users.entity";
import {HttpException, HttpStatus} from "@nestjs/common";
import {WsException} from "@nestjs/websockets";

@EntityRepository(Card)
export class CardRepository extends Repository<Card> {
    async createCard(pack: Pack, item: Item, user: User): Promise<Card> {
        const card = this.create();
        card.item = item;
        card.pack = pack;
        card.user = user;
        return await this.save(card);
    }

    async transferCard(cardId, sender: User, receiver: User) {
        const card = await this.findOne(cardId);
        if (!card)
            throw new HttpException("Card with same id is not found", HttpStatus.BAD_REQUEST);
        if (card.userId != sender.id)
            throw new HttpException("You are not owner this card", HttpStatus.FORBIDDEN);
        card.user = receiver;
        return await this.save(card);
    }

    async transferCards(cardIds:number[], sender: User, receiver: User) {
        const cards = await this.findByIds(cardIds);
        if (cards.length == 0)
            throw new HttpException("Cards with same id is not found", HttpStatus.BAD_REQUEST);
        const someHasDifferentOwner = cards.some((card)=>card.userId != sender.id);
        if (someHasDifferentOwner)
            throw new HttpException("You are not owner this card", HttpStatus.FORBIDDEN);
        return await Promise.all(cards.map(card=>{
            card.user = receiver;
            return this.save(card);
        }))}
    async getCards(cardsIds:number[]):Promise<Card[]>{
        const queryBuilder = this.createQueryBuilder('card')
        return await queryBuilder.select('card')
            .where('card.id in (:...cardsIds)', {cardsIds: cardsIds})
            .leftJoinAndSelect('card.item', 'item')
            .getMany();
    }

}