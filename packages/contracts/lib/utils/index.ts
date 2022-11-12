// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const timeout = (prom: any, time: number) => {
  return Promise.race([prom, new Promise((_resolve, reject) => setTimeout(() => reject(new Error("timeout")), time))]);
};

export const getTimeDiff = (startAt: Date, endAt: Date) => {
  const date = new Date(endAt.getTime() - startAt.getTime());
  const parts = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
  return parts.map((s) => String(s).padStart(2, "0")).join(":");
};
