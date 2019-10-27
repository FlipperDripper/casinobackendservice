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

@Injectable()
export class CardsService {
    @Transaction()
    async createPack(packDto: PackDto, @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Pack>{
        const pack = packRep.create({
            name: packDto.name,
            price: packDto.price
        });
        return await packRep.save(pack);
    }
    @Transaction()
    async createItem(itemDto: ItemDto,
                     @TransactionRepository(ItemRepository) itemRep?: ItemRepository,
                     @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Item>{
        const pack = await packRep.findOne(itemDto.packId);
        if(!pack) throw new HttpException("Pack with same id not found", HttpStatus.BAD_REQUEST);
        return await itemRep.createItem(itemDto, pack);
    }
    @Transaction()
    async createCard(cardDto: CardDto,
                     @TransactionRepository(CardRepository) cardRep?: CardRepository,
                     @TransactionRepository(UserRepository) userRep?: UserRepository,
                     @TransactionRepository(ItemRepository) itemRep?: ItemRepository,
                     @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Card>{
        const pack = await packRep.findOne(cardDto.packId);
        if(!pack) throw new HttpException("Pack with same id is not found", HttpStatus.BAD_REQUEST);
        const item = await itemRep.findOne(cardDto.itemId);
        if(!item) throw new HttpException("Item with same id is not found", HttpStatus.BAD_REQUEST);
        const user = await userRep.findById(cardDto.userId);
        if(!user) throw new HttpException("User with same id is not found", HttpStatus.BAD_REQUEST);
        return cardRep.createCard(cardDto, pack, item, user);
    }
    @Transaction()
    async getPacks(@TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Pack[]>{
        return await packRep.find();
    }

    @Transaction()
    async getPackById(id: number, @TransactionRepository(PackRepository) packRep?: PackRepository): Promise<Pack>{
        const pack = await packRep.findOne(id);
        if(!pack) throw new HttpException("Pack with same id is not found", HttpStatus.NOT_FOUND);
        return pack;
    }

    @Transaction()
    async getItems(@TransactionRepository(ItemRepository) itemRep?: ItemRepository): Promise<Item[]>{
        return await itemRep.find();
    }

    @Transaction()
    async getItemById(id: number, @TransactionRepository(ItemRepository) itemRep?: ItemRepository): Promise<Item>{
        const item = await itemRep.findOne(id);
        if(!item) throw new HttpException("Item with same id is not found", HttpStatus.NOT_FOUND);
        return item;
    }

    @Transaction()
    async getCardsByUserId(id: number,
                           @TransactionRepository(UserRepository) userRep?: UserRepository,
                           @TransactionRepository(CardRepository) cardRep?: CardRepository): Promise<Card[]>{
        const user = await userRep.findById(id);
        if(!user) throw new HttpException("User with same id is not found", HttpStatus.BAD_REQUEST);
        return await cardRep.find({user: user});
    }
    @Transaction()
    async getCardById(id: number, @TransactionRepository(CardRepository) cardRep?: CardRepository): Promise<Card>{
        const card = await cardRep.findOne(id);
        if(!card) throw new HttpException("Card with same id is not found", HttpStatus.NOT_FOUND);
        return card;
    }


}