import { MigrationInterface, QueryRunner } from 'typeorm';

export class MyNewMigration1738558153410 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DO $$ 
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
                CREATE TYPE public."user_role_enum" AS ENUM ('admin', 'editor', 'viewer');
            END IF;
        END $$;
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public."user" (
            id serial PRIMARY KEY,
            "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
            "updatedAt" TIMESTAMP DEFAULT now() NOT NULL,
            "createdBy" INT NULL,
            "updatedBy" INT NULL,
            email VARCHAR NOT NULL UNIQUE,
            "password" VARCHAR NOT NULL,
            "role" public."user_role_enum" DEFAULT 'viewer' NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public.blacklisted_tokens (
            id serial PRIMARY KEY,
            "token" VARCHAR NOT NULL,
            "blacklistedAt" TIMESTAMP DEFAULT now() NOT NULL,
            expiry TIMESTAMP NOT NULL
        );
    `);

    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS public."document" (
            id serial PRIMARY KEY,
            "createdAt" TIMESTAMP DEFAULT now() NOT NULL,
            "updatedAt" TIMESTAMP DEFAULT now() NOT NULL,
            "createdBy" INT NULL,
            "updatedBy" INT NULL,
            title VARCHAR NOT NULL,
            "fileName" VARCHAR NOT NULL,
            "filePath" VARCHAR NOT NULL,
            "fileSize" INT NOT NULL
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "document";`);
    await queryRunner.query(`DROP TABLE "blacklisted_tokens";`);
    await queryRunner.query(`DROP TABLE "user";`);
  }
}
