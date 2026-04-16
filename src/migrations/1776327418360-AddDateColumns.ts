import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDateColumns1776327418360 implements MigrationInterface {
  name = 'AddDateColumns1776327418360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "genre" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "book" ALTER COLUMN "genre" DROP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "order_item" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "createdAt"`);
  }
}
