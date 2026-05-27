import type { BankRawItem, BankEnrichedItem, BankIndexEntry } from '../types/bank';
import type { CatalogResource } from '../types';

export const SUPERTYPE_LABELS: Record<number, string> = {
  1: 'Amulettes',
  2: 'Armes',
  3: 'Anneaux',
  4: 'Ceintures',
  5: 'Bottes',
  6: 'Consommables',
  7: 'Boucliers',
  9: 'Ressources',
  10: 'Chapeaux',
  11: 'Capes',
  12: 'Familiers',
  13: 'Dofus',
  14: 'Objets de quête',
  15: 'Montures',
  25: 'Runes',
  0: 'Divers',
};

function catalogSuperType(category: string): number {
  return category === 'smithmagic_rune' ? 25 : 9;
}

export function formatQuantity(n: number): string {
  return n.toLocaleString('fr-FR');
}

export function enrichBankItems(
  rawItems: BankRawItem[],
  catalog: CatalogResource[],
  bankIndex: Record<string, BankIndexEntry>,
): BankEnrichedItem[] {
  const catalogById = new Map(catalog.map(r => [r.id, r]));

  return rawItems
    .map((entry): BankEnrichedItem => {
      const catItem = catalogById.get(entry.item_id);
      if (catItem) {
        return {
          itemId: entry.item_id,
          quantity: entry.quantity,
          name: catItem.name,
          image: catItem.image,
          superTypeId: catalogSuperType(catItem.category),
          level: catItem.level,
          description: catItem.description,
        };
      }

      const idxEntry = bankIndex[String(entry.item_id)];
      if (idxEntry) {
        return {
          itemId: entry.item_id,
          quantity: entry.quantity,
          name: idxEntry.n,
          image: idxEntry.img,
          superTypeId: idxEntry.st,
          level: idxEntry.l,
          description: idxEntry.d,
        };
      }

      return {
        itemId: entry.item_id,
        quantity: entry.quantity,
        name: `Objet #${entry.item_id}`,
        image: null,
        superTypeId: 0,
        level: 0,
        description: '',
      };
    })
    .sort((a, b) => {
      if (a.superTypeId !== b.superTypeId) return a.superTypeId - b.superTypeId;
      return a.name.localeCompare(b.name, 'fr');
    });
}

export function computeBankValue(items: BankEnrichedItem[], prices: Record<number, number>): number {
  return items.reduce((sum, item) => sum + item.quantity * (prices[item.itemId] ?? 0), 0);
}

export function parseBankJson(raw: string): BankRawItem[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error('Format invalide : tableau attendu');
  return parsed.map((entry, i) => {
    if (
      typeof entry !== 'object' ||
      entry === null ||
      typeof (entry as Record<string, unknown>).item_id !== 'number' ||
      typeof (entry as Record<string, unknown>).quantity !== 'number'
    ) {
      throw new Error(`Entrée invalide à l'index ${i}`);
    }
    return { item_id: (entry as Record<string, number>).item_id, quantity: (entry as Record<string, number>).quantity };
  });
}
