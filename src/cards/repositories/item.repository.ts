import {EntityRepository, Repository} from "typeorm";
import {Item} from "../item.entity";

@EntityRepository(Item)
class ItemRepository extends Repository<Item>{
}