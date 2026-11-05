// UK date formatting, fixed to London time so the server and the browser always agree.
const ukDate = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function formatUkDate(iso: string): string {
  return ukDate.format(new Date(iso));
}
