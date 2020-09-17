import { b } from "./store";

export const url = () => {
  const corsAnywhere = "https://cors-anywhere.herokuapp.com/";
  const endpoint = "https://api.twitter.com/1.1/statuses/user_timeline.json";
  const screenName = `${b.screenName.key}=${b.screenName.value}`;
  const count = `${b.count.key}=${b.count.value}`;
  return `${corsAnywhere}${endpoint}?${screenName}&${count}`;
};
