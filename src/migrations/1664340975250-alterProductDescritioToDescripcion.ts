import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterProductDescritioToDescripcion1664340975250
  implements MigrationInterface
{
  name = 'alterProductDescritioToDescripcion1664340975250';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "description" TO "descripcion"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" RENAME COLUMN "descripcion" TO "description"`,
    );
  }
}
