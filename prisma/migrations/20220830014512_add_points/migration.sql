-- DropIndex
DROP INDEX "user_id_discord_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 100,
ALTER COLUMN "id_guild" DROP NOT NULL;
