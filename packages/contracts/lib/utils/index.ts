export const getTimeDiff = (startAt: Date, endAt: Date) => {
  const date = new Date(endAt.getTime() - startAt.getTime());
  const parts = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
  return parts.map((s) => String(s).padStart(2, "0")).join(":");
};
