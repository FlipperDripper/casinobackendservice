import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserTable1572099434929 implements MigrationInterface {
    name = 'CreateUserTable1572099434929'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "balance" numeric NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`, undefined);
    }

}
