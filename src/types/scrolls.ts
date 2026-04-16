export type ScrollStatId =
  | "agilite"
  | "chance"
  | "force"
  | "intelligence"
  | "sagesse"
  | "vitalite";

export type ScrollTierType = "petit" | "normal" | "grand" | "puissant";

export interface ScrollResource {
  name: string;
  quantity: number;
  kind?: "equipment";
}

export interface ScrollNpcOption {
  id: string;
  npc: string;
  position: [number, number];
  resources: ScrollResource[];
}

export interface ScrollTier {
  type: ScrollTierType;
  pointsPerUse: number;
  statLimit: number;
  options: ScrollNpcOption[];
}

export interface StatScrollData {
  id: ScrollStatId;
  label: string;
  icon: string;
  tiers: ScrollTier[];
}

export interface ScrollMethodPhase {
  tierType: ScrollTierType;
  from: number;
  to: number;
  pointsPerScroll: number;
}

export interface ScrollMethod {
  id: string;
  label: string;
  description: string;
  phases: ScrollMethodPhase[];
}
