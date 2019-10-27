import {EntityRepository, Repository} from "typeorm";
import {Item} from "../item.entity";
import {ItemDto} from "../dto/item.dto";
import {Pack} from "../pack.entity";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item>{
    async createItem(itemDto: ItemDto, pack: Pack): Promise<Item>{
        const item = this.create({
            name: itemDto.name,
            value: itemDto.value
        })
        item.pack = pack;
        return await this.save(item)
    }
}