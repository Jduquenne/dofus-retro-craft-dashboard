export interface BankRawItem {
  item_id: number;
  quantity: number;
}

export interface BankSession {
  id: string;
  items: BankRawItem[];
  importedAt: number;
}

export interface BankIndexEntry {
  n: string;
  t: number;
  st: number;
  img: string | null;
  l: number;
  d: string;
}

export interface BankEnrichedItem {
  itemId: number;
  quantity: number;
  name: string;
  image: string | null;
  superTypeId: number;
  level: number;
  description: string;
}
