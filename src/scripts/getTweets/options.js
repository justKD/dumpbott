import { c } from "./store";

export const options = () => {
  return {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "My Twitter App v1.0.23",
      "Accept-Encoding": "gzip",
      Host: "api.twitter.com",
      Authorization: "Bearer " + c.join(""),
    },
  };
};
