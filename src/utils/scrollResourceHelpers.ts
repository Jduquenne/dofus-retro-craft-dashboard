import rawCatalog from '../data/resources/resources-catalog.json';
import type { CatalogResource } from '../types';

const catalogByName = new Map<string, CatalogResource>(
    (rawCatalog as CatalogResource[]).map(r => [r.name.toLowerCase(), r]),
);

export function findInCatalog(name: string): CatalogResource | undefined {
    return catalogByName.get(name.toLowerCase());
}

const SCROLL_RESOURCE_IMAGES: Record<string, string> = {
    'Aile de Tofu Maléfique':          'resources/wing/376.svg',
    'Ailes de Moskitos':               'resources/wing/307.svg',
    'Amulette du Bucheron':            'items/amulet/783.svg',
    'Anneaux Agilesques':              'items/ring/850.svg',
    'Ceinture de Chance':              'items/belt/860.svg',
    'Côtes de Rib':                    'resources/bone/432.svg',
    'Défense de Sanglier':             'resources/bone/387.svg',
    'Epine de Champ Champ':            'resources/resource/377.svg',
    'Gelée Fraise':                    'resources/jelly/368.svg',
    'Gelée Menthe':                    'resources/jelly/369.svg',
    'Graine de Tournesol':             'resources/seed/288.svg',
    'Langue de Pissenlit Diabolique':  'resources/plant/374.svg',
    'Ongles Chevaucheurs de Karne':    'resources/bone/382.svg',
    "Pattes d'Arakne":                 'resources/leg/365.svg',
    'Pic de Prespic':                  'resources/bone/407.svg',
    'Pince de Crabe':                  'resources/bone/379.svg',
    'Queues du Mulou':                 'resources/tail/438.svg',
    'Sporme de Champ Champ':           'resources/resource/378.svg',
    'Trèfles à 5 feuilles':            'resources/plant/395.svg',
};

const SCROLL_RESOURCE_CANONICAL_NAMES: Record<string, string> = {
    'Aile de Tofu Maléfique':          'Aile du Tofu Maléfique',
    'Ailes de Moskitos':               'Ailes de Moskito',
    'Côtes de Rib':                    'Côtes du Rib',
    'Défense de Sanglier':             'Défense du Sanglier',
    'Epine de Champ Champ':            'Epine du Champ Champ',
    'Gelée Fraise':                    'Gelée à la Fraise',
    'Gelée Menthe':                    'Gelée à la Menthe',
    'Graine de Tournesol':             'Graine de Tournesol sauvage',
    'Langue de Pissenlit Diabolique':  'Langue du Pissenlit Diabolique',
    'Ongles Chevaucheurs de Karne':    'Ongle de Chevaucheur de Karne',
    "Pattes d'Arakne":                 "Patte d'Arakne",
    'Pic de Prespic':                  'Pic du Prespic',
    'Pince de Crabe':                  'Pince du Crabe',
    'Queues du Mulou':                 'Queue du Mulou',
    'Sporme de Champ Champ':           'Sporme du Champ Champ',
    'Trèfles à 5 feuilles':            'Trèfle à 5 feuilles',
};

export function findScrollResourceInCatalog(scrollName: string): CatalogResource | undefined {
    return findInCatalog(scrollName) ?? findInCatalog(SCROLL_RESOURCE_CANONICAL_NAMES[scrollName] ?? '');
}

export function getScrollResourceImage(name: string): string | undefined {
    const entry = findScrollResourceInCatalog(name);
    if (entry) return entry.image;
    return SCROLL_RESOURCE_IMAGES[name];
}

const EQUIPMENT_RECIPE_NAME_MAP: Record<string, string> = {
    'Anneaux Agilesques': 'Anneau Agilesque',
    'Amulette du Bucheron': 'Amulette du Bûcheron',
};

export function resolveEquipmentRecipeName(scrollName: string): string {
    return EQUIPMENT_RECIPE_NAME_MAP[scrollName] ?? scrollName;
}

export type PriceSource = 'catalog' | 'manual' | 'none';

export interface ResolvedPrice {
    price: number;
    source: PriceSource;
    catalogId?: number;
}
