import {EntityRepository, Repository} from "typeorm";
import {Card} from "../card.entity";
import {CardDto} from "../dto/card.dto";
import {Pack} from "../pack.entity";
import {Item} from "../item.entity";
import {User} from "../../users/users.entity";

@EntityRepository(Card)
export class CardRepository extends Repository<Card>{
    async createCard(cardDto: CardDto, pack: Pack, item: Item, user: User): Promise<Card> {
        const card = this.create();
        card.item = item;
        card.pack = pack;
        card.user = user;
        return await this.save(card);
    }

}