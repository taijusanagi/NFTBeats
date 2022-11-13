SET check_function_bodies = false;
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';
CREATE TABLE public."syncedBlocks" (
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
ALTER TABLE ONLY public.transfers
    ADD CONSTRAINT "Transfer_pkey" PRIMARY KEY ("blockNumber", "transactionIndex", "logIndex");
ALTER TABLE ONLY public."syncedBlocks"
    ADD CONSTRAINT blocks_pkey PRIMARY KEY ("blockNumber");
