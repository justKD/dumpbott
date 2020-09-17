/**
 * https://codepen.io/lukewbarratt/pen/EZerQv?editors=1010
 */

import { enemiesList } from "./enemiesList";
import { insultsList } from "./insultsList";
import { conclusionsList } from "./conclusionsList";

const getRandomItem = (a: any[]) => a[Math.floor(Math.random() * a.length)];

export const generateTweet = () => {
  const enemy = getRandomItem(enemiesList);
  const insult = getRandomItem(insultsList);
  const conclusion = getRandomItem(conclusionsList);
  return `${enemy} ${insult}. ${conclusion}`;
};
