import {MigrationInterface, QueryRunner} from "typeorm";

export class AddBalanceOperations1572176277747 implements MigrationInterface {
    name = 'AddBalanceOperations1572176277747'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "balance_operation_entity_type_enum" AS ENUM('deposit', 'withdraw')`, undefined);
        await queryRunner.query(`CREATE TABLE "balance_operation_entity" ("id" SERIAL NOT NULL, "type" "balance_operation_entity_type_enum" NOT NULL, "value" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_1187404c2e6530187693db7408d" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "balance_operation_entity" ADD CONSTRAINT "FK_35920e3960918cf2de180779fa0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balance_operation_entity" DROP CONSTRAINT "FK_35920e3960918cf2de180779fa0"`, undefined);
        await queryRunner.query(`DROP TABLE "balance_operation_entity"`, undefined);
        await queryRunner.query(`DROP TYPE "balance_operation_entity_type_enum"`, undefined);
    }

}
