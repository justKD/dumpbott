import { KDRoll } from "./KDRoll";
import { generateTweet } from "./generateTweet";
import { regexp } from "./regexp";
import { endings } from "./endings";

export const getTweetText = (tweets) => {
  let text = "";
  if (tweets.length > 0) {
    const index = KDRoll.d(tweets.length);
    if (tweets[index]) {
      text = tweets[index];
    } else {
      text = generateTweet();
    }
  } else {
    text = generateTweet();
  }

  const ending = endings[KDRoll.d(endings.length) - 1];
  text = regexp.do(text, ending);
  return text.toLowerCase();
};
