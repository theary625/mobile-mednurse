/**
 * Convert a time label like "11:30 AM" from one timezone to another.
 * Uses a reference date to calculate the UTC offset difference.
 */
export function convertTimeLabel(
  label: string,
  baseTimezone: string,
  visitorTimezone: string,
  referenceDate?: Date
): string {
  if (baseTimezone === visitorTimezone) return label;

  const match = label.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return label;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hours !== 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  // Use reference date or today
  const ref = referenceDate || new Date();
  // Build a UTC date that represents the given time in the base timezone
  // by finding the offset of the base timezone
  const utcRef = new Date(
    Date.UTC(ref.getFullYear(), ref.getMonth(), ref.getDate(), hours, minutes, 0)
  );

  // Get the offset of the base timezone at this UTC time
  const baseOffset = getTimezoneOffsetMinutes(utcRef, baseTimezone);
  // Adjust to true UTC: if base is UTC-5 (offset -300), and label says 11:00 AM,
  // then UTC is 11:00 + 300min = 16:00 UTC
  const trueUtc = new Date(utcRef.getTime() - baseOffset * 60000);

  // Now format in visitor timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: visitorTimezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatter.format(trueUtc);
}

function getTimezoneOffsetMinutes(utcDate: Date, timeZone: string): number {
  // Format the date in the target timezone to extract components
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(utcDate);

  const get = (type: string) =>
    parseInt(parts.find((p) => p.type === type)?.value || "0");

  const localDate = new Date(
    Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") === 24 ? 0 : get("hour"), get("minute"), get("second"))
  );

  return (localDate.getTime() - utcDate.getTime()) / 60000;
}
