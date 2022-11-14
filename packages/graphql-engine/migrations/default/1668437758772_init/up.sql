SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE TABLE public.blocks (
    "blockNumber" integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL
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
CREATE VIEW public.nfts AS
 SELECT t1.contract,
    t1."tokenId",
    t1."to" AS holder
   FROM (public.transfers t1
     LEFT JOIN public.transfers t2 ON (((t1.contract = t2.contract) AND (t1."tokenId" = t2."tokenId") AND (t1."blockNumber" < t2."blockNumber") AND (t1."transactionIndex" < t2."transactionIndex") AND (t1."logIndex" < t2."logIndex"))));
ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "Transfer_pkey" PRIMARY KEY ("blockNumber", "transactionIndex", "logIndex");
ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT blocks_pkey PRIMARY KEY ("blockNumber");
