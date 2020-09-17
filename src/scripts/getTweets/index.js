import { options } from "./options";
import { url } from "./url";
import { base, recordID } from "./table";
import { record } from "./record";
import { beenOneDay } from "./beenOneDay";

export let getTweets = [];
let localTweets = {};

const retrieveTweetsFromTwitter = () => {
  console.log("attempting to retrieve tweets from twitter");
  /* Attempt to fetch tweets from Twitter. */
  try {
    fetch(url(), options())
      .then((response) => response.text())
      .then((data) => {
        try {
          localTweets = JSON.parse(data);
          console.log("success");
        } catch (err) {
          console.error(err);
        }
      });
  } catch (err) {
    console.error(err);
  }
};

let attempts = 0;
const storeTweetsInAirtable = () => {
  console.log("attempting to store tweets in airtable");
  /* If there are tweets already loaded from twitter... */
  if (Object.keys(localTweets).length > 0) {
    getTweets = Object.keys(localTweets).map((key) => localTweets[key]["text"]);
    try {
      base("dumpbott").update(record(getTweets), (err) => {
        if (!err) {
          console.log("success");
        } else {
          console.log("error updating record");
          console.error(err);
        }
      });
    } catch (err) {
      console.log("error updating record");
      console.error(err);
    }
  } else {
    /* ... else repeat check until max. */
    if (attempts < 40) {
      setTimeout(() => {
        attempts++;
        storeTweetsInAirtable();
      }, 500);
    } else {
      console.error("unable to store tweets in airtable - tweets not found");
    }
  }
};

const retrieveTweetsFromAirtable = () => {
  base("dumpbott").find(recordID, function (err, record) {
    if (err) {
      console.log("error retrieving airtable record");
      console.error(err);
      return;
    }

    if (
      record.fields["date"] === undefined ||
      record.fields["json"] === undefined
    ) {
      console.log("neither field exists in airtable");
      /* If neither relevant field is defined... */
      retrieveTweetsFromTwitter();
      storeTweetsInAirtable();
    } else {
      /* ... else check if it's been a day... */
      const now = new Date();
      const last = new Date(JSON.parse(record.fields["date"]));
      if (beenOneDay(now, last)) {
        console.log("its been longer than a day");
        retrieveTweetsFromTwitter();
        storeTweetsInAirtable();
      } else {
        /* ... else make the tweets available. */
        getTweets = JSON.parse(record.fields["json"]);
        console.log("retrieved tweets from airtable");
      }
    }
  });
};
retrieveTweetsFromAirtable();
