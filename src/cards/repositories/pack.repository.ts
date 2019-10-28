import {EntityRepository, Repository} from "typeorm";
import {Pack} from "../pack.entity";
import {HttpException, HttpStatus} from "@nestjs/common";

@EntityRepository(Pack)
export class PackRepository extends Repository<Pack>{
    async getPackById(id: number):Promise<Pack>{
        const queryBuilder = this.createQueryBuilder('pack');
        const pack = await queryBuilder
            .select("pack")
            .where("pack.id = :id",{id})
            .leftJoinAndSelect("pack.items", "items")
            .getOne();
        if(!pack) throw new HttpException("Pack with same id is not found", HttpStatus.NOT_FOUND);
        return pack;
    }
}