import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Transaction, TransactionRepository} from "typeorm";
import {PackDto} from "./dto/pack.dto";
import {PackRepository} from "./repositories/pack.repository";
import {Pack} from "./pack.entity";
import {ItemDto} from "./dto/item.dto";
import {ItemRepository} from "./repositories/item.repository";
import {Item} from "./item.entity";
import {CardDto} from "./dto/card.dto";
import {CardRepository} from "./repositories/card.repository";
import {Card} from "./card.entity";
import {UserRepository} from "../users/user.repository";
import {FinanceRepository} from "../finance/finance.repository";

@Injectable()
export class CardsService {
    @Transaction()
    async createPack(packDto: PackDto, @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Pack> {
        const pack = packRep.create({
            name: packDto.name,
            price: packDto.price
        });
        return await packRep.save(pack);
    }

    @Transaction()
    async createItem(itemDto: ItemDto,
                     @TransactionRepository(ItemRepository) itemRep?: ItemRepository,
                     @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Item> {
        const pack = await packRep.findOne(itemDto.packId);
        if (!pack) throw new HttpException("Pack with same id not found", HttpStatus.BAD_REQUEST);
        return await itemRep.createItem(itemDto, pack);
    }

    @Transaction()
    async createCard(cardDto: CardDto,
                     @TransactionRepository(CardRepository) cardRep?: CardRepository,
                     @TransactionRepository(UserRepository) userRep?: UserRepository,
                     @TransactionRepository(ItemRepository) itemRep?: ItemRepository,
                     @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Card> {
        const pack = await packRep.findOne(cardDto.packId);
        if (!pack) throw new HttpException("Pack with same id is not found", HttpStatus.BAD_REQUEST);
        const item = await itemRep.findOne(cardDto.itemId);
        if (!item) throw new HttpException("Item with same id is not found", HttpStatus.BAD_REQUEST);
        const user = await userRep.findById(cardDto.userId);
        if (!user) throw new HttpException("User with same id is not found", HttpStatus.BAD_REQUEST);
        return cardRep.createCard(pack, item, user);
    }

    @Transaction()
    async getPacks(@TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Pack[]> {
        return await packRep.find();
    }

    @Transaction()
    async getPackById(id: number,
                      @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Pack> {
        return packRep.getPackById(id);

    }

    @Transaction()
    async getItems(@TransactionRepository(ItemRepository) itemRep?: ItemRepository): Promise<Item[]> {
        return await itemRep.find();
    }

    @Transaction()
    async getItemById(id: number, @TransactionRepository(ItemRepository) itemRep?: ItemRepository): Promise<Item> {
        const item = await itemRep.findOne(id);
        if (!item) throw new HttpException("Item with same id is not found", HttpStatus.NOT_FOUND);
        return item;
    }

    @Transaction()
    async getCardsByUserId(id: number,
                           @TransactionRepository(UserRepository) userRep?: UserRepository,
                           @TransactionRepository(CardRepository) cardRep?: CardRepository): Promise<Card[]> {
        const user = await userRep.findById(id);
        if (!user) throw new HttpException("User with same id is not found", HttpStatus.BAD_REQUEST);
        const card = await cardRep.find({userId: user.id});
        if (!card) throw new HttpException("Card with same id is not found", HttpStatus.NOT_FOUND);
        return card;
    }

    @Transaction()
    async getCardById(id: number, @TransactionRepository(CardRepository) cardRep?: CardRepository): Promise<Card> {
        const card = await cardRep.findOne(id);
        if (!card) throw new HttpException("Card with same id is not found", HttpStatus.NOT_FOUND);
        return card;
    }

    @Transaction()
    async buyCard(userId: number, packId: number,
                  @TransactionRepository(UserRepository) userRep?: UserRepository,
                  @TransactionRepository(FinanceRepository) finRep?: FinanceRepository,
                  @TransactionRepository(PackRepository) packRep?: PackRepository,
                  @TransactionRepository(CardRepository) cardRep?: CardRepository,
                  @TransactionRepository(ItemRepository) itemRep?: ItemRepository) {
        const user = await userRep.findById(userId);
        const pack = await packRep.getPackById(packId);
        if (!pack)
            throw new HttpException('Pack with same id is not found', HttpStatus.BAD_REQUEST);
        if (Number(pack.price) > Number(user.balance))
            throw new HttpException('Not enough funds', HttpStatus.BAD_REQUEST);
        if (pack.items.length == 0)
            throw new HttpException('Pack does not have any items', HttpStatus.BAD_REQUEST);
        const itemIndex = CardsService.getItemIndex(pack.items.length);
        const item = pack.items[itemIndex];
        const card = await cardRep.createCard(pack, item, user);
        await finRep.withdraw(user.id, pack.price, userRep);
        return card;
    }

    private static getItemIndex(countItems: number): number {
        return Math.round(Math.random() * (countItems - 1))
    }

    @Transaction()
    async transfer(senderId: number, receiverId: number, cardId: number,
                   @TransactionRepository(UserRepository) userRep?: UserRepository,
                   @TransactionRepository(CardRepository) cardRep?: CardRepository){
        const sender = await userRep.findById(senderId);
        const receiver = await userRep.findById(receiverId);
        if(!receiver)
            throw new HttpException("Receiver with same id is not found", HttpStatus.BAD_REQUEST);
        return await cardRep.transferCard(cardId, sender, receiver);
    }
    @Transaction()
    async isOwner(userId: number, cardsId:number[], @TransactionRepository(CardRepository) cardRep?: CardRepository){
        const cards = await cardRep.findByIds(cardsId);
        return !cards.some(card=>card.userId != userId)
    }
}