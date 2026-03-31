import { buildContentIndex, writeContentIndex } from "./content-lib";
const { index, problems } = await buildContentIndex();
if (problems.length > 0) {
    console.error("Content validation failed:");
    for (const problem of problems) {
        console.error(`- ${problem}`);
    }
    process.exit(1);
}
await writeContentIndex(index);
console.log(`Generated content index with ${index.entries.length} entries.`);
