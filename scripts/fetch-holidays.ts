import { promises as fs } from "node:fs";
import path from "node:path";

type HolidayApiRecord = {
  date: string;
  localName: string;
  name: string;
};

type GeneratedHolidayIndex = {
  generatedAt: string;
  country: "CN" | "PT";
  years: number[];
  events: Array<{
    id: string;
    title: string;
    date: string;
    type: "holiday-cn" | "holiday-pt";
    summary: string;
  }>;
};

type HolidayEvent = GeneratedHolidayIndex["events"][number];

type ChinaHolidayRange = {
  title: string;
  summary: string;
  start: string;
  end: string;
};

const countries = [
  { code: "CN" as const, type: "holiday-cn" as const, fileName: "cn.generated.json" },
  { code: "PT" as const, type: "holiday-pt" as const, fileName: "pt.generated.json" },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear + 1];
const outputDir = path.join(process.cwd(), "src/generated/holidays");

// Actual mainland China holiday ranges follow the State Council General Office notice.
// Announced years are expanded day-by-day; unannounced years fall back to public-holiday dates.
const chinaHolidayOverridesByYear: Partial<Record<number, ChinaHolidayRange[]>> = {
  2026: [
    { title: "元旦", summary: "New Year's Day", start: "2026-01-01", end: "2026-01-03" },
    { title: "春节", summary: "Chinese New Year (Spring Festival)", start: "2026-02-15", end: "2026-02-23" },
    { title: "清明节", summary: "Qingming Festival", start: "2026-04-04", end: "2026-04-06" },
    { title: "劳动节", summary: "Labour Day", start: "2026-05-01", end: "2026-05-05" },
    { title: "端午节", summary: "Dragon Boat Festival", start: "2026-06-19", end: "2026-06-21" },
    { title: "中秋节", summary: "Mid-Autumn Festival", start: "2026-09-25", end: "2026-09-27" },
    { title: "国庆节", summary: "National Day", start: "2026-10-01", end: "2026-10-07" },
  ],
};

function enumerateDateRange(start: string, end: string) {
  const dates: string[] = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const limit = new Date(`${end}T00:00:00Z`);

  while (cursor <= limit) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function createChinaOverrideEvents(): HolidayEvent[] {
  return years.flatMap((year) =>
    (chinaHolidayOverridesByYear[year] ?? []).flatMap((holiday) =>
      enumerateDateRange(holiday.start, holiday.end).map((date) => ({
        id: `${date}-holiday-cn`,
        title: holiday.title,
        date,
        type: "holiday-cn",
        summary: holiday.summary,
      })),
    ),
  );
}

async function fetchCountry(country: (typeof countries)[number]): Promise<GeneratedHolidayIndex> {
  const records: HolidayApiRecord[] = [];

  for (const year of years) {
    if (country.code === "CN" && chinaHolidayOverridesByYear[year]?.length) {
      continue;
    }

    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country.code}`);
    if (!response.ok) {
      throw new Error(`${country.code} ${year} fetch failed with ${response.status}`);
    }

    const payload = (await response.json()) as HolidayApiRecord[];
    records.push(...payload);
  }

  const apiEvents: HolidayEvent[] = records.map((record) => ({
    id: `${record.date}-${country.type}`,
    title: record.localName || record.name,
    date: record.date,
    type: country.type,
    summary: record.name,
  }));

  const events =
    country.code === "CN"
      ? [...createChinaOverrideEvents(), ...apiEvents]
          .sort((left, right) => left.date.localeCompare(right.date))
          .filter((event, index, all) => index === all.findIndex((candidate) => candidate.id === event.id))
      : apiEvents;

  return {
    generatedAt: new Date().toISOString(),
    country: country.code,
    years,
    events,
  };
}

async function writeFallback(filePath: string, country: (typeof countries)[number]) {
  const fallback: GeneratedHolidayIndex = {
    generatedAt: new Date().toISOString(),
    country: country.code,
    years,
    events: [],
  };

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(fallback, null, 2)}\n`, "utf8");
}

await fs.mkdir(outputDir, { recursive: true });

for (const country of countries) {
  const filePath = path.join(outputDir, country.fileName);

  try {
    const generated = await fetchCountry(country);
    await fs.writeFile(filePath, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
    console.log(`Updated ${country.code} holidays for ${years.join(", ")}.`);
  } catch (error) {
    if (!(await fs
      .access(filePath)
      .then(() => true)
      .catch(() => false))) {
      await writeFallback(filePath, country);
      console.warn(`Holiday fetch failed for ${country.code}; wrote empty fallback instead.`);
    } else {
      console.warn(`Holiday fetch failed for ${country.code}; kept existing file.`);
    }

    console.warn(error instanceof Error ? error.message : String(error));
  }
}
