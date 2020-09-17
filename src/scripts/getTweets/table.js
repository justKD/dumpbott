import { a } from "./store";

const Airtable = require("airtable");
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: a.api,
});
export const base = Airtable.base(a.base);
export const recordID = a.record;
