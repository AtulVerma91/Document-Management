import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyNewMigration1738558153410 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     CREATE TYPE public."user_role_enum" AS ENUM (
	'admin',
	'editor',
	'viewer'); `);
    await queryRunner.query(`
    CREATE TABLE public."user" (
	id serial4 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" int4 NULL,
	"updatedBy" int4 NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" public."user_role_enum" DEFAULT 'viewer'::user_role_enum NOT NULL,
	CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id),
	CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email)
); `);
    await queryRunner.query(` 
    CREATE TABLE public.blacklisted_tokens (
	id serial4 NOT NULL,
	"token" varchar NOT NULL,
	"blacklistedAt" timestamp DEFAULT now() NOT NULL,
	expiry timestamp NOT NULL,
	CONSTRAINT "PK_8fb1bc7333c3b9f249f9feaa55d" PRIMARY KEY (id)
);`);
    await queryRunner.query(`
    CREATE TABLE public."document" (
	id serial4 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"createdBy" int4 NULL,
	"updatedBy" int4 NULL,
	title varchar NOT NULL,
	"fileName" varchar NOT NULL,
	"filePath" varchar NOT NULL,
	"fileSize" int4 NOT NULL,
	CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY (id)
); `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "document";`);
    await queryRunner.query(`DROP TABLE "blacklisted_tokens";`);
    await queryRunner.query(`DROP TABLE "user";`);
  }
}
