import {MigrationInterface, QueryRunner} from "typeorm";

export class setup1669940577159 implements MigrationInterface {
    name = 'setup1669940577159'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit" ("id" SERIAL NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "changes" json NOT NULL, CONSTRAINT "PK_1d3d120ddaf7bc9b1ed68ed463a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "upc" character varying NOT NULL, "description" character varying NOT NULL, "sale_price" numeric NOT NULL, "purchase_price" numeric NOT NULL, "stock" integer NOT NULL, CONSTRAINT "UQ_a0c8dae2b7ac9ecc90d15750a8d" UNIQUE ("upc"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "audit"`);
    }

}
