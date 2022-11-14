alter table "public"."blocks" alter column "expectedTransactionCount" drop not null;
alter table "public"."blocks" add column "expectedTransactionCount" int4;
