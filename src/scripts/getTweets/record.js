import { a } from "./store";

export const record = getTweets => {
  return [
    {
      id: a.record,
      fields: {
        json: JSON.stringify(getTweets),
        date: JSON.stringify(new Date()),
      },
    },
  ];
};
