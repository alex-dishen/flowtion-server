-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Inactive', 'Pending');

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar_image_url" TEXT,
    "avatar_image_bucket_key" TEXT,
    "is_soft_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
