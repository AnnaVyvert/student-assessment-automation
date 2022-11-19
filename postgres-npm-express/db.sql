CREATE TABLE group (
	"id" serial NOT NULL,
	"number" integer NOT NULL,
	"start_year" integer NOT NULL,
	"cipher" varchar NOT NULL,
	"deleted" BOOLEAN NOT NULL,
	CONSTRAINT "group_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE student (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"surname" varchar NOT NULL,
	"patronym" varchar NOT NULL,
	"sex" BOOLEAN NOT NULL,
	"birth" DATE NOT NULL,
	"group_id" integer NOT NULL,
	"deleted" BOOLEAN NOT NULL,
	CONSTRAINT "student_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE subject (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	"hours" integer NOT NULL,
	"exam" BOOLEAN NOT NULL,
	"deleted" BOOLEAN NOT NULL,
	CONSTRAINT "subject_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE result_list (
	"id" serial NOT NULL,
	"student_id" integer NOT NULL,
	"subject_id" integer NOT NULL,
	"mark" varchar,
	"date" DATE,
	"deleted" BOOLEAN NOT NULL,
	CONSTRAINT "result_list_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "student" ADD CONSTRAINT "student_fk0" FOREIGN KEY ("group_id") REFERENCES "group"("id");


ALTER TABLE "result_list" ADD CONSTRAINT "result_list_fk0" FOREIGN KEY ("student_id") REFERENCES "student"("id");
ALTER TABLE "result_list" ADD CONSTRAINT "result_list_fk1" FOREIGN KEY ("subject_id") REFERENCES "subject"("id");