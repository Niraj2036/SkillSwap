-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "SwapStatus" AS ENUM ('pending', 'accepted', 'rejected');

-- CreateTable
CREATE TABLE "user" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "profilePhoto" TEXT,
    "availability" TEXT[],
    "password" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userOfferedSkill" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "skillId" BIGINT NOT NULL,

    CONSTRAINT "userOfferedSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userWantedSkill" (
    "id" BIGSERIAL NOT NULL,
    "userId" BIGINT NOT NULL,
    "skillId" BIGINT NOT NULL,

    CONSTRAINT "userWantedSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swapRequest" (
    "id" BIGSERIAL NOT NULL,
    "requesterId" BIGINT NOT NULL,
    "responderId" BIGINT NOT NULL,
    "requesterSkillId" BIGINT NOT NULL,
    "responderSkillId" BIGINT NOT NULL,
    "status" "SwapStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "swapRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swapFeedback" (
    "id" BIGSERIAL NOT NULL,
    "swapId" BIGINT NOT NULL,
    "reviewerId" BIGINT NOT NULL,
    "revieweeId" BIGINT NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swapFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "id" BIGSERIAL NOT NULL,
    "otp" INTEGER NOT NULL,
    "expiry" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "userId" BIGINT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "skill_name_key" ON "skill"("name");

-- CreateIndex
CREATE UNIQUE INDEX "userOfferedSkill_userId_skillId_key" ON "userOfferedSkill"("userId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "userWantedSkill_userId_skillId_key" ON "userWantedSkill"("userId", "skillId");

-- AddForeignKey
ALTER TABLE "userOfferedSkill" ADD CONSTRAINT "userOfferedSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userOfferedSkill" ADD CONSTRAINT "userOfferedSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userWantedSkill" ADD CONSTRAINT "userWantedSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userWantedSkill" ADD CONSTRAINT "userWantedSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapRequest" ADD CONSTRAINT "swapRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapRequest" ADD CONSTRAINT "swapRequest_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapRequest" ADD CONSTRAINT "swapRequest_requesterSkillId_fkey" FOREIGN KEY ("requesterSkillId") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapRequest" ADD CONSTRAINT "swapRequest_responderSkillId_fkey" FOREIGN KEY ("responderSkillId") REFERENCES "skill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapFeedback" ADD CONSTRAINT "swapFeedback_swapId_fkey" FOREIGN KEY ("swapId") REFERENCES "swapRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapFeedback" ADD CONSTRAINT "swapFeedback_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swapFeedback" ADD CONSTRAINT "swapFeedback_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otps" ADD CONSTRAINT "otps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
