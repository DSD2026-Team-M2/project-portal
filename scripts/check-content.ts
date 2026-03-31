import { buildContentIndex } from "./content-lib";

const { index, problems } = await buildContentIndex();

if (problems.length > 0) {
  console.error("Content validation failed:");
  for (const problem of problems) {
    console.error(`- ${problem}`);
  }
  process.exit(1);
}

console.log(`Content validation passed for ${index.entries.length} entries.`);
