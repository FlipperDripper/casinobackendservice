import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameRelationOfItem1572255617971 implements MigrationInterface {
    name = 'RenameRelationOfItem1572255617971'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_f8f1459f6cabc01f5081477223b"`, undefined);
        await queryRunner.query(`ALTER TABLE "item" RENAME COLUMN "packId" TO "pack_id"`, undefined);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_83503e49b33d008012e64dac91b" FOREIGN KEY ("pack_id") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "item" DROP CONSTRAINT "FK_83503e49b33d008012e64dac91b"`, undefined);
        await queryRunner.query(`ALTER TABLE "item" RENAME COLUMN "pack_id" TO "packId"`, undefined);
        await queryRunner.query(`ALTER TABLE "item" ADD CONSTRAINT "FK_f8f1459f6cabc01f5081477223b" FOREIGN KEY ("packId") REFERENCES "pack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

}
