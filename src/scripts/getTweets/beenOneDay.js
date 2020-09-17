export const beenOneDay = (now, last) => {
  let diff = (now.getTime() - last.getTime()) / 1000;
  diff /= 60 * 60;
  diff = Math.abs(Math.round(diff));
  return diff > 23;
};
