/**
 * Calculates the current day of the year based on UTC time.
 * @returns number 1-366
 */
export const getDayOfYearUTC = (): number => {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const getProgressPercentage = (day: number, total: number = 365): number => {
  return (day / total) * 100;
};