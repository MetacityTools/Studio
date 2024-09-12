import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1726137471660 implements MigrationInterface {
    name = 'InitialMigration1726137471660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" character varying NOT NULL, "email" character varying NOT NULL, "picture" character varying, "enabled" boolean NOT NULL DEFAULT false, "id_auth0" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "embeds" ("id" SERIAL NOT NULL, "bucket_id" character varying, "version" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" integer, CONSTRAINT "PK_c44f5ea08993d1a72a9539693af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "models" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "coordinate_system" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" character varying NOT NULL, CONSTRAINT "PK_ef9ed7160ea69013636466bf2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projectVersion" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" integer, CONSTRAINT "PK_f19675b2d1d6fa80a1abbfed6d6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_bd55b203eb9f92b0c8390380010" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "embeds" ADD CONSTRAINT "FK_a7e59abcef6dc080b7fb537f177" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "models" ADD CONSTRAINT "FK_3d769505b3996edfba330529b39" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projectVersion" ADD CONSTRAINT "FK_106c5bfd35120f16a9c17be3bdb" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projectVersion" DROP CONSTRAINT "FK_106c5bfd35120f16a9c17be3bdb"`);
        await queryRunner.query(`ALTER TABLE "models" DROP CONSTRAINT "FK_3d769505b3996edfba330529b39"`);
        await queryRunner.query(`ALTER TABLE "embeds" DROP CONSTRAINT "FK_a7e59abcef6dc080b7fb537f177"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_bd55b203eb9f92b0c8390380010"`);
        await queryRunner.query(`DROP TABLE "projectVersion"`);
        await queryRunner.query(`DROP TABLE "models"`);
        await queryRunner.query(`DROP TABLE "embeds"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
