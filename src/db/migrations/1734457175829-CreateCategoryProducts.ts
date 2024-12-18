import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCategoryProducts1734457175829 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category_product" (
              "categoryId" integer NOT NULL,
              "productId" integer NOT NULL,
              PRIMARY KEY ("categoryId", "productId"),
              FOREIGN KEY ("categoryId") REFERENCES "category" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
              FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "category_product"`);
    }

}
