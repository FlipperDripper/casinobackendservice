import {EntityRepository, Repository} from "typeorm";
import {Pack} from "../pack.entity";

@EntityRepository(Pack)
class PackRepository extends Repository<Pack>{
}