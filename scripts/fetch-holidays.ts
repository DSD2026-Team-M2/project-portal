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

const countries = [
  { code: "CN" as const, type: "holiday-cn" as const, fileName: "cn.generated.json" },
  { code: "PT" as const, type: "holiday-pt" as const, fileName: "pt.generated.json" },
];

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear + 1];
const outputDir = path.join(process.cwd(), "src/generated/holidays");

async function fetchCountry(country: (typeof countries)[number]): Promise<GeneratedHolidayIndex> {
  const records: HolidayApiRecord[] = [];

  for (const year of years) {
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/${country.code}`);
    if (!response.ok) {
      throw new Error(`${country.code} ${year} fetch failed with ${response.status}`);
    }

    const payload = (await response.json()) as HolidayApiRecord[];
    records.push(...payload);
  }

  return {
    generatedAt: new Date().toISOString(),
    country: country.code,
    years,
    events: records.map((record) => ({
      id: `${record.date}-${country.type}`,
      title: record.localName || record.name,
      date: record.date,
      type: country.type,
      summary: record.name,
    })),
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
