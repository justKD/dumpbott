import { endings } from "./endings";

export const regexp = {
  do: (text, ending) => {
    const url = /(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?\S/g;
    const RT = /(RT)/g;
    const hashtag = /(#)/g;
    const amp = /(&amp;)/g;
    const ellipsis = /\w+(\u2026)/g;
    const name = /(@realDonaldTrump)/g;
    const buttigieg = /(buttigieg)/g;
    const dotAt = /(\.+[@])/g;
    const withRe = /(w\/)/g;
    text = text.replace(url, "");
    text = text.replace(RT, "re-tweet ");
    text = text.replace(hashtag, "hashtag ");
    text = text.replace(amp, "and ");
    text = text.replace(ellipsis, `.. fatal error. ${ending}`);
    text = text.replace(name, "@dumpbott");
    text = text.replace(buttigieg, "buttjudge");
    text = text.replace(dotAt, "@");
    text = text.replace(withRe, "with ");
    return text;
  },
  undo: text => {
    endings.forEach(ending => {
      const re = new RegExp(ending, "g");
      text = text.replace(re, "");
    });

    const error = new RegExp(" .. fatal error. ", "g");
    const RT = new RegExp("re-tweet", "g");
    const hashtag = /(hashtag\s)/g;
    const name = /(@dumpbott)/g;
    const buttigieg = /(buttjudge)/g;
    const crooked1 = /(crookit)/g;
    const crooked2 = /(crook-it)/g;

    text = text.replace(error, "");
    text = text.replace(hashtag, "#");
    text = text.replace(RT, "RT");
    text = text.replace(name, "@realdonaldtrump");
    text = text.replace(buttigieg, "buttigieg");
    text = text.replace(crooked1, "crooked");
    text = text.replace(crooked2, "crooked");
    return text;
  }
};
