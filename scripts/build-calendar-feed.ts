import { promises as fs } from "node:fs";
import path from "node:path";

import { siteMode } from "../src/config/siteMode";
import { calendarEvents, projectMeta } from "../src/data/portalData";

type HolidayFeedEvent = {
  id: string;
  title: string;
  date: string;
  type: "holiday-cn" | "holiday-pt";
  summary: string;
};

type FeedDefinition = {
  fileName: string;
  calendarName: string;
  excludedHolidayTypes: HolidayFeedEvent["type"][];
};

const portalSiteUrl = "https://dsd2026-team-m2.github.io/project-portal/";
const outputDir = path.join(process.cwd(), "public", "calendar");
const defaultTimedEventDurationMinutes = 60;
const holidayFiles = [
  path.join(process.cwd(), "src", "generated", "holidays", "cn.generated.json"),
  path.join(process.cwd(), "src", "generated", "holidays", "pt.generated.json"),
];

const feeds: FeedDefinition[] = [
  {
    fileName: "m2-project-complete.ics",
    calendarName: `${projectMeta.projectName} · M2 Calendar · Complete`,
    excludedHolidayTypes: [],
  },
  {
    fileName: "m2-project-cn-team.ics",
    calendarName: `${projectMeta.projectName} · M2 Calendar · CN Team`,
    excludedHolidayTypes: ["holiday-cn"],
  },
  {
    fileName: "m2-project-pt-team.ics",
    calendarName: `${projectMeta.projectName} · M2 Calendar · PT Team`,
    excludedHolidayTypes: ["holiday-pt"],
  },
];

function foldIcsLine(line: string) {
  const chunks: string[] = [];
  let cursor = line;

  while (cursor.length > 73) {
    chunks.push(cursor.slice(0, 73));
    cursor = ` ${cursor.slice(73)}`;
  }

  chunks.push(cursor);
  return chunks.join("\r\n");
}

function escapeIcsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function formatUtcDateTime(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function formatDateValue(value: string) {
  return value.replace(/-/g, "");
}

function addDays(date: string, days: number) {
  const cursor = new Date(`${date}T00:00:00Z`);
  cursor.setUTCDate(cursor.getUTCDate() + days);
  return cursor.toISOString().slice(0, 10);
}

function resolveEventUrl(eventLink: string, eventId: string) {
  if (eventLink.startsWith("http://") || eventLink.startsWith("https://")) {
    return eventLink;
  }

  if (eventLink === "/calendar") {
    return `${portalSiteUrl}#/calendar#${eventId}`;
  }

  return `${portalSiteUrl}#${eventLink}`;
}

async function loadHolidayEvents() {
  const holidayIndexes = await Promise.all(
    holidayFiles.map(async (filePath) => JSON.parse(await fs.readFile(filePath, "utf8")) as { events: HolidayFeedEvent[] }),
  );

  return holidayIndexes.flatMap((index) => index.events);
}

function createProjectEventLines() {
  const visibleEvents = calendarEvents.filter((event) => !(siteMode.hideSimulatedData && event.sample));

  return visibleEvents.flatMap((event) => {
    const title = escapeIcsText(event.title.en);
    const summary = escapeIcsText(event.summary.en);
    const url = escapeIcsText(resolveEventUrl(event.link, event.id));
    const stamp = formatUtcDateTime(`${projectMeta.lastUpdated}T00:00:00Z`);

    const lines = [
      "BEGIN:VEVENT",
      foldIcsLine(`UID:${event.id}@dsd2026-team-m2.github.io`),
      `DTSTAMP:${stamp}`,
      foldIcsLine(`SUMMARY:${title}`),
      foldIcsLine(`DESCRIPTION:${summary}\\n\\nPortal link: ${url}`),
      foldIcsLine(`URL:${url}`),
      foldIcsLine(`CATEGORIES:${event.type},project-portal`),
    ];

    if (event.allDay ?? !event.start.includes("T")) {
      const startDate = event.start.slice(0, 10);
      const endDate = event.end ? event.end.slice(0, 10) : startDate;
      lines.push(`DTSTART;VALUE=DATE:${formatDateValue(startDate)}`);
      lines.push(`DTEND;VALUE=DATE:${formatDateValue(addDays(endDate, 1))}`);
    } else {
      const startDateTime = formatUtcDateTime(event.start);
      const endDateTime = event.end
        ? formatUtcDateTime(event.end)
        : formatUtcDateTime(new Date(new Date(event.start).getTime() + defaultTimedEventDurationMinutes * 60_000).toISOString());

      lines.push(`DTSTART:${startDateTime}`);
      lines.push(`DTEND:${endDateTime}`);
    }

    if (event.relatedTeams.length > 0) {
      lines.push(foldIcsLine(`X-DSD-RELATED-TEAMS:${escapeIcsText(event.relatedTeams.join(", "))}`));
    }

    lines.push("END:VEVENT");
    return lines;
  });
}

function createHolidayEventLines(holidays: HolidayFeedEvent[]) {
  return holidays.flatMap((event) => {
    const title = escapeIcsText(event.title);
    const summary = escapeIcsText(event.summary);
    const url = escapeIcsText(`${portalSiteUrl}#/calendar#${event.id}`);
    const stamp = formatUtcDateTime(`${projectMeta.lastUpdated}T00:00:00Z`);

    return [
      "BEGIN:VEVENT",
      foldIcsLine(`UID:${event.id}@dsd2026-team-m2.github.io`),
      `DTSTAMP:${stamp}`,
      foldIcsLine(`SUMMARY:${title}`),
      foldIcsLine(`DESCRIPTION:${summary}\\n\\nPortal link: ${url}`),
      foldIcsLine(`URL:${url}`),
      foldIcsLine(`CATEGORIES:${event.type},holiday,project-portal`),
      `DTSTART;VALUE=DATE:${formatDateValue(event.date)}`,
      `DTEND;VALUE=DATE:${formatDateValue(addDays(event.date, 1))}`,
      "END:VEVENT",
    ];
  });
}

async function buildFeeds() {
  const holidayEvents = await loadHolidayEvents();
  const projectEventLines = createProjectEventLines();

  await fs.mkdir(outputDir, { recursive: true });

  for (const feed of feeds) {
    const filteredHolidayEvents = holidayEvents.filter((event) => !feed.excludedHolidayTypes.includes(event.type));
    const calendarLines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DSD2026 Team M2//Project Portal Calendar//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      foldIcsLine(`X-WR-CALNAME:${escapeIcsText(feed.calendarName)}`),
      "X-WR-TIMEZONE:Asia/Shanghai",
      ...projectEventLines,
      ...createHolidayEventLines(filteredHolidayEvents),
      "END:VCALENDAR",
    ];

    await fs.writeFile(path.join(outputDir, feed.fileName), `${calendarLines.join("\r\n")}\r\n`, "utf8");
  }
}

await buildFeeds();

console.log(`Updated project calendar feeds at ${path.relative(process.cwd(), outputDir)}.`);
