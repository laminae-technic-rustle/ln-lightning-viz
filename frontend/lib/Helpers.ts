import { flow } from "fp-ts/function";

/* Takes a bool, converts it into something human readable */
const boolToYesNo = (b: boolean) => (b ? "Yes" : "No");

/* Takes a unix timestamp, converts it to a date */
const unixToDate = (u: number) => new Date(u);

/* Takes a Date, converts it into a humanly readable date / time string */
const toLocaleDateTimeString = (d: Date) =>
  `${d.toLocaleDateString()} : ${d.toLocaleTimeString()}`;

/* Takes a unix timestamp, converts it into a humanly readable date / time string */
const unixToLocaleDateTime = flow(unixToDate, toLocaleDateTimeString);

export {
  boolToYesNo,
  unixToDate,
  toLocaleDateTimeString,
  unixToLocaleDateTime
};
