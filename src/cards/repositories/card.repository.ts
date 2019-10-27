import {EntityRepository, Repository} from "typeorm";
import {Card} from "../card.entity";

@EntityRepository(Card)
class CardRepository extends Repository<Card>{
}