import type { PodItem } from '../types';

export function computeFreePods(maxPods: number, usedPods: number): number {
  return Math.max(0, maxPods - usedPods);
}

export function computePodPerRun(items: PodItem[]): number {
  return items.reduce((sum, item) => sum + item.podWeight * item.quantity, 0);
}

export function computeMaxRuns(freePods: number, podPerRun: number): number {
  if (podPerRun <= 0) return 0;
  return Math.floor(freePods / podPerRun);
}
