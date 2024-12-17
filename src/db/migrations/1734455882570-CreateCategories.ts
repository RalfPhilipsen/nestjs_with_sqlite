import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategories1734455882570 implements MigrationInterface {
    name = 'CreateCategories1734455882570';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category" (
              "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
              "name" varchar NOT NULL,
              "created_at" datetime NOT NULL DEFAULT (datetime('now')),
              "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "category"`);
    }
}
