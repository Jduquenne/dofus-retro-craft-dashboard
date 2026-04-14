import type {
  StatScrollData,
  ScrollMethod,
  ScrollTierType,
  ScrollNpcOption,
} from '../data/scrolls';

export interface ScrollPhaseResult {
  tierType: ScrollTierType;
  scrollsNeeded: number;
  option: ScrollNpcOption;
}

export interface ResourceTotal {
  name: string;
  quantity: number;
  kind: 'resource' | 'equipment';
}

export interface ScrollCalculationResult {
  phases: ScrollPhaseResult[];
  totalResources: ResourceTotal[];
}

// Sélections de l'utilisateur : pour chaque tier, quel PNJ choisir (index dans options[])
export type NpcSelections = Partial<Record<ScrollTierType, string>>; // tierType → option.id

export function calculateScrollsNeeded(
  stat: StatScrollData,
  method: ScrollMethod,
  currentStat: number,
  targetStat: number,
  npcSelections: NpcSelections,
): ScrollCalculationResult {
  const phases: ScrollPhaseResult[] = [];

  for (const phase of method.phases) {
    const effectiveFrom = Math.max(phase.from, currentStat);
    const effectiveTo = Math.min(phase.to, targetStat);
    const pointsNeeded = Math.max(0, effectiveTo - effectiveFrom);

    if (pointsNeeded <= 0) continue;

    const scrollsNeeded = Math.ceil(pointsNeeded / phase.pointsPerScroll);

    const tier = stat.tiers.find(t => t.type === phase.tierType);
    if (!tier) continue;

    // Trouver l'option sélectionnée par le joueur, sinon la première par défaut
    const selectedId = npcSelections[phase.tierType];
    const option =
      tier.options.find(o => o.id === selectedId) ?? tier.options[0];

    if (!option) continue;

    phases.push({ tierType: phase.tierType, scrollsNeeded, option });
  }

  // Agréger toutes les ressources
  const resourceMap = new Map<string, { quantity: number; kind: 'resource' | 'equipment' }>();
  for (const phase of phases) {
    for (const resource of phase.option.resources) {
      const current = resourceMap.get(resource.name);
      resourceMap.set(resource.name, {
        quantity: (current?.quantity ?? 0) + resource.quantity * phase.scrollsNeeded,
        kind: resource.kind === 'equipment' ? 'equipment' : 'resource',
      });
    }
  }

  const totalResources: ResourceTotal[] = Array.from(resourceMap.entries())
    .map(([name, { quantity, kind }]) => ({ name, quantity, kind }))
    .sort((a, b) => b.quantity - a.quantity);

  return { phases, totalResources };
}

export const TIER_LABELS: Record<ScrollTierType, string> = {
  petit: 'Petit',
  normal: 'Normal',
  grand: 'Grand',
  puissant: 'Puissant',
};

export const TIER_COLORS: Record<ScrollTierType, string> = {
  petit:    'bg-dofus-success/20 text-dofus-success border-dofus-success/40',
  normal:   'bg-dofus-border-md/20 text-dofus-text-md border-dofus-border-md/40',
  grand:    'bg-dofus-gold/20 text-dofus-text border-dofus-gold/40',
  puissant: 'bg-dofus-orange/20 text-dofus-orange border-dofus-orange/40',
};
