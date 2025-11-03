import type { Resource } from "../types";
import { CategoryTypes } from "./categoryTypes";

export const initialResources: Resource[] = [
  {
    id: "1022",
    name: "Ailes cassées",
    category: CategoryTypes.WING,
    pods: 10,
    level: "1",
    description:
      "Ces ailes cassées vous rappellent sans cesse que vous auriez vraiment dû vous recoucher.",
    monsterDrops: [],
    inTheCraftOf: [],
    unitPrice: 10,
    quantity: 1,
  },
  {
    id: "307",
    name: "Ailes de Moskito",
    category: CategoryTypes.WING,
    pods: 1,
    level: "2",
    description:
      "Ces ailes très fines ont la particularité de favoriser la réflexion des personnes qui osent les mâcher. Leur goût est assez proche des oeufs de Kwak pourris, c'est pour cela qu'elles sont essentiellement utilisées pour les potions de sagesse.",
    monsterDrops: [],
    inTheCraftOf: [],
    unitPrice: 10,
    quantity: 1,
  },
  {
    id: "367",
    name: "Aile du Tofu Maléfique",
    category: CategoryTypes.WING,
    pods: 1,
    level: "3",
    description:
      "Cette ridicule petite aile ne sert pas à grand-chose au Tofu Maléfique, si ce n'est à brasser de l'air pour déséquilibrer les Moskitos.",
    monsterDrops: [],
    inTheCraftOf: [],
    unitPrice: 10,
    quantity: 1,
  },
];
