import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBookIsActiveField1777370730290 implements MigrationInterface {
  name = 'AddBookIsActiveField1777370730290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a79f97aeb6833eae69adc5815"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_756f53ab9466eb52a52619ee01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ADD "isActive" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_1a79f97aeb6833eae69adc5815" ON "cart_item" ("cartId", "bookId") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_756f53ab9466eb52a52619ee01" ON "cart" ("userId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_756f53ab9466eb52a52619ee01"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1a79f97aeb6833eae69adc5815"`,
    );
    await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "isActive"`);
    await queryRunner.query(
      `CREATE INDEX "IDX_756f53ab9466eb52a52619ee01" ON "cart" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1a79f97aeb6833eae69adc5815" ON "cart_item" ("cartId", "bookId") `,
    );
  }
}
