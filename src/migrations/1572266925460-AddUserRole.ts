import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUserRole1572266925460 implements MigrationInterface {
    name = 'AddUserRole1572266925460'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('client', 'admin', 'financier')`, undefined);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "user_role_enum" NOT NULL DEFAULT 'client'`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`, undefined);
        await queryRunner.query(`DROP TYPE "user_role_enum"`, undefined);
    }

}
