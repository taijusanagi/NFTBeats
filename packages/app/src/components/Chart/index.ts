import dynamic from "next/dynamic";

export const Chart = dynamic(() => import("./Chart").then((mod) => mod.Chart), { ssr: false });
