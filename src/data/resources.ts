import type { Resource } from "../types";
import { CategoryTypes } from "./categoryTypes";

export const initialResources: Resource[] = [
  {
    id: "1",
    name: "Ailes cassées",
    category: CategoryTypes.WING,
    pods: 10,
    level: "1",
    description:
      "Looking at these broken wings makes you realise just how badly you wanted to stay in bed this morning.",
    monsterDrops: [],
    inTheCraftOf: [],
    unitPrice: 10,
    quantity: 1,
  },
];
