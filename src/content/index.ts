import rawContentIndex from "../generated/content-index.generated.json";
import type { GeneratedContentIndex } from "../utils/content";

export const contentIndex = rawContentIndex as GeneratedContentIndex;
