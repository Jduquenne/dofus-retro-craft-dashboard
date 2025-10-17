import type { Resource } from "../types";

export const initialResources: Resource[] = [
  { id: "fer", name: "Fer", type: "Minerai", unitPrice: 10, quantity: 100 },
  {
    id: "bois_chene",
    name: "Bois de Chêne",
    type: "Bois",
    unitPrice: 5,
    quantity: 200,
  },
  {
    id: "cuivre",
    name: "Cuivre",
    type: "Minerai",
    unitPrice: 15,
    quantity: 50,
  },
  { id: "lin", name: "Lin", type: "Textile", unitPrice: 8, quantity: 150 },
];
