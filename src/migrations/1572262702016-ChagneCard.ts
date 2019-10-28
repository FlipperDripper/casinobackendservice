import {MigrationInterface, QueryRunner} from "typeorm";

export class ChagneCard1572262702016 implements MigrationInterface {
    name = 'ChagneCard1572262702016'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e11ab30f120f5834ba8c4b6f05e"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_00ec72ad98922117bad8a86f980"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "pack_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "item_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "user_id" SET NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1" FOREIGN KEY ("pack_id") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e11ab30f120f5834ba8c4b6f05e" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_00ec72ad98922117bad8a86f980" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_00ec72ad98922117bad8a86f980"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e11ab30f120f5834ba8c4b6f05e"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1"`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "user_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "item_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "pack_id" DROP NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_00ec72ad98922117bad8a86f980" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e11ab30f120f5834ba8c4b6f05e" FOREIGN KEY ("item_id") REFERENCES "item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_6434f381922d6ef7f462bf3e7a1" FOREIGN KEY ("pack_id") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
