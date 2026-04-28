import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReviewIsActiveField1777371198353 implements MigrationInterface {
  name = 'AddReviewIsActiveField1777371198353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "review" ADD "isActive" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "isActive"`);
  }
}
