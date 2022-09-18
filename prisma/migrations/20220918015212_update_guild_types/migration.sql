/*
  Warnings:

  - The primary key for the `guilds` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_id_guild_fkey";

-- AlterTable
ALTER TABLE "guilds" DROP CONSTRAINT "guilds_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "channel" SET DATA TYPE TEXT,
ADD CONSTRAINT "guilds_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id_guild" SET DATA TYPE TEXT,
ALTER COLUMN "id_discord" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_guild_fkey" FOREIGN KEY ("id_guild") REFERENCES "guilds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
