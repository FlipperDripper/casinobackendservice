import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateBalanceOperation1572176675926 implements MigrationInterface {
    name = 'CreateBalanceOperation1572176675926'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "balance_operation" ("id" SERIAL NOT NULL, "type" "balance_operation_type_enum" NOT NULL, "value" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_8cb82ba3c5dd568479da6ddab04" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "balance_operation" ADD CONSTRAINT "FK_7bffc1965cfdd704ec02dd3c799" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "balance_operation" DROP CONSTRAINT "FK_7bffc1965cfdd704ec02dd3c799"`, undefined);
        await queryRunner.query(`DROP TABLE "balance_operation"`, undefined);
    }

}
