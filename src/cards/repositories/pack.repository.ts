import {EntityRepository, Repository} from "typeorm";
import {Pack} from "../pack.entity";

@EntityRepository(Pack)
export class PackRepository extends Repository<Pack>{
}