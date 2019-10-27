import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigrate1572192575697 implements MigrationInterface {
    name = 'InitialMigrate1572192575697'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "item" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "value" numeric NOT NULL, "packId" integer, CONSTRAINT "PK_d3c0c71f23e7adcf952a1d13423" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "pack" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "price" numeric NOT NULL, CONSTRAINT "PK_c125718b999b41a621b0d799e02" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "balance_operation_type_enum" AS ENUM('deposit', 'withdraw')`, undefined);
        await queryRunner.query(`CREATE TABLE "balance_operation" ("id" SERIAL NOT NULL, "type" "balance_operation_type_enum" NOT NULL, "value" numeric NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_8cb82ba3c5dd568479da6ddab04" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "login" character varying NOT NULL, "password" character varying NOT NULL, "balance" numeric NOT NULL DEFAULT 0, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a62473490b3e4578fd683235c5e" UNIQUE ("login"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "packId" integer, "itemId" integer, "userId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_f8f1459f6cabc01f5081477223b" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "balance_operation" ADD CONSTRAINT "FK_7bffc1965cfdd704ec02dd3c799" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_fbdd43be199714a83c79ba57d2a" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_c3384e7f8560629186d003d4426" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_c3384e7f8560629186d003d4426"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_fbdd43be199714a83c79ba57d2a"`, undefined);
        await queryRunner.query(`ALTER TABLE "balance_operation" DROP CONSTRAINT "FK_7bffc1965cfdd704ec02dd3c799"`, undefined);
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_f8f1459f6cabc01f5081477223b"`, undefined);
        await queryRunner.query(`DROP TABLE "card"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "balance_operation"`, undefined);
        await queryRunner.query(`DROP TYPE "balance_operation_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "pack"`, undefined);
        await queryRunner.query(`DROP TABLE "item"`, undefined);
    }

}
