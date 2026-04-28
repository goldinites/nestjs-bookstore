import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexBookTitle1777372187179 implements MigrationInterface {
  name = 'CreateIndexBookTitle1777372187179';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a57ed982a92075b08c8e517dcc"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2923ff91d1d6724275c0532126" ON "book" ("title", "author", "genre", "language", "createdAt", "publishedYear") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2923ff91d1d6724275c0532126"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a57ed982a92075b08c8e517dcc" ON "book" ("author", "genre", "publishedYear", "language", "createdAt") `,
    );
  }
}
