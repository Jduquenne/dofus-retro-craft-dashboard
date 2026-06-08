export interface DofusStat {
  label: string;
  min: number;
  max: number;
}

export interface DofusItem {
  id: number;
  name: string;
  stats: DofusStat[];
}

export interface DofusPrice {
  id: string;
  price: number;
}

export interface DofusVendor {
  id: string;
  coords: string;
  pseudo: string;
}
