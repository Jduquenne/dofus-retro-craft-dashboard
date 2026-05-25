import type { DofusItem, DofusStat } from '../types/dofus';

export function dofusPriceKey(dofusId: number, ...values: number[]): string {
  return [dofusId, ...values].join('_');
}

export function statRange(stat: DofusStat): number[] {
  return Array.from({ length: stat.max - stat.min + 1 }, (_, i) => stat.min + i);
}

export function isFixedStat(dofus: DofusItem): boolean {
  return dofus.stats.every(s => s.min === s.max);
}

export function isTwoStatDofus(dofus: DofusItem): boolean {
  return dofus.stats.length === 2;
}

export function formatKamas(value: number): string {
  if (value === 0) return '—';
  if (value >= 1_000_000) return `${(value / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mk`;
  if (value >= 1_000) return `${(value / 1_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} k`;
  return value.toLocaleString('fr-FR');
}
