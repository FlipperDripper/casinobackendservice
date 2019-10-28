import {MigrationInterface, QueryRunner} from "typeorm";
import config from "../config";
import * as bcrypt from 'bcryptjs';

export class AddFinancier1572267109558 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const financier = config.financier;
        const password = await bcrypt.hash(financier.password, 12)
        await queryRunner.query(`INSERT INTO "user" (first_name, last_name, login, password, role) VALUES ('${financier.firstName}', '${financier.lastName}', '${financier.login}',  '${password}', '${financier.role}');`)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        const financier = config.financier;
        await queryRunner.query(`DELETE FROM "user" WHERE "user".login='financier';`)
    }

}
