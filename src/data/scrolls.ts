import type { StatScrollData, ScrollMethod } from '../types/scrolls';

import agiliteData from './scrolls/agilite.json';
import chanceData from './scrolls/chance.json';
import forceData from './scrolls/force.json';
import intelligenceData from './scrolls/intelligence.json';
import sagesseData from './scrolls/sagesse.json';
import vitaliteData from './scrolls/vitalite.json';
import methodsData from './scrolls/methods.json';

export const scrollsData: StatScrollData[] = [
  agiliteData,
  chanceData,
  forceData,
  intelligenceData,
  sagesseData,
  vitaliteData,
] as StatScrollData[];

export const SCROLL_METHODS: ScrollMethod[] = methodsData as ScrollMethod[];
