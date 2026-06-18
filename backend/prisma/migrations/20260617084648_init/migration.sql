-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('INTERNSHIP', 'FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'INTERVIEWING', 'OFFER', 'REJECTED');

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_type" "JobType" NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
    "applied_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);
