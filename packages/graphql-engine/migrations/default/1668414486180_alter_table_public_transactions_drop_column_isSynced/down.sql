alter table "public"."transactions" alter column "isSynced" set default false;
alter table "public"."transactions" alter column "isSynced" drop not null;
alter table "public"."transactions" add column "isSynced" bool;
