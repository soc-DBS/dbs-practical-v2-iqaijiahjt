-- CreateTable
CREATE TABLE "student" (
    "admin_no" CHAR(4) NOT NULL,
    "student_name" VARCHAR(30) NOT NULL,
    "region" VARCHAR(30) NOT NULL,
    "address" VARCHAR(100) NOT NULL,
    "mobile_phone" CHAR(8),
    "home_phone" CHAR(8),
    "dob" DATE,
    "nationality" VARCHAR(30),
    "case_code" VARCHAR(5),

    CONSTRAINT "student_pkey" PRIMARY KEY ("admin_no")
);
