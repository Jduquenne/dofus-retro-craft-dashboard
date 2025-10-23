import type { Recipe } from "../types";

export const initialRecipes: Recipe[] = [
  {
    id: "epee_fer",
    name: "Épée de Fer",
    profession: "sword_smith",
    level: 10,
    resources: [
      { resourceId: "fer", quantity: 5 },
      { resourceId: "bois_chene", quantity: 2 },
    ],
    xpGained: 100,
    hdvPrice: 500,
    merchantPrice: 200,
  },
  {
    id: "anneau_cuivre",
    name: "Anneau de Cuivre",
    profession: "jeweler",
    level: 5,
    resources: [{ resourceId: "cuivre", quantity: 3 }],
    xpGained: 50,
    hdvPrice: 300,
    merchantPrice: 100,
  },
];
