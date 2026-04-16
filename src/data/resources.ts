import type { Resource } from "../types";
import rawCatalog from "./resources/resources-catalog.json";

export const initialResources: Resource[] = rawCatalog as unknown as Resource[];
