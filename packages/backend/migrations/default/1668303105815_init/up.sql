SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE TABLE public."syncedBlocks" (
    "blockNumber" integer NOT NULL
);
CREATE TABLE public.transfers (
    "blockNumber" integer NOT NULL,
    "transactionIndex" integer NOT NULL,
    "logIndex" integer NOT NULL,
    contract text NOT NULL,
    "from" text NOT NULL,
    "to" text NOT NULL,
    "tokenId" numeric(78,0) NOT NULL
);
CREATE VIEW public."unsyncedBlocks" AS
 SELECT all_ids.all_ids AS "blockNumber"
   FROM generate_series(( SELECT min("syncedBlocks"."blockNumber") AS min
           FROM public."syncedBlocks"), ( SELECT max("syncedBlocks"."blockNumber") AS max
           FROM public."syncedBlocks")) all_ids(all_ids)
EXCEPT
 SELECT "syncedBlocks"."blockNumber"
   FROM public."syncedBlocks";
ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "Transfer_pkey" PRIMARY KEY ("blockNumber", "transactionIndex", "logIndex");
ALTER TABLE ONLY public."syncedBlocks"
    ADD CONSTRAINT blocks_pkey PRIMARY KEY ("blockNumber");
