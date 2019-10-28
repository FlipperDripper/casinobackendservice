import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameRelations1572255437724 implements MigrationInterface {
    name = 'RenameRelations1572255437724'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_fbdd43be199714a83c79ba57d2a"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_c3384e7f8560629186d003d4426"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "packId"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "itemId"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "userId"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD "pack_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD "item_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD "user_id" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1" FOREIGN KEY ("pack_id") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e11ab30f120f5834ba8c4b6f05e" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_00ec72ad98922117bad8a86f980" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_00ec72ad98922117bad8a86f980"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e11ab30f120f5834ba8c4b6f05e"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "user_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "item_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "pack_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD "userId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD "itemId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD "packId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_c3384e7f8560629186d003d4426" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_fbdd43be199714a83c79ba57d2a" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
