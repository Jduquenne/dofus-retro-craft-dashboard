import { useState } from "react";
import Dexie, { type Table } from "dexie";
import type { Resource, Recipe, Profession, KamasGoal } from "../types";

interface DofusDB extends Dexie {
  resources: Table<Resource>;
  recipes: Table<Recipe>;
  professions: Table<Profession>;
  goals: Table<KamasGoal & { id: string }>;
}

const db = new Dexie("DofusRetroCraftDB") as DofusDB;

db.version(1).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
});

// v2 : ajout des ressources Paysan + recettes farines
db.version(2).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
}).upgrade((tx) => {
  return Promise.all([
    tx.table("resources").clear(),
    tx.table("recipes").clear(),
  ]);
});

// v3 : ajout des ressources Bûcheron, Mineur, Alchimiste, Pêcheur, Chasseur
db.version(3).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
}).upgrade((tx) => {
  return tx.table("resources").clear();
});

export const useIndexedDB = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = async <T>(table: Table<T>, defaultData: T[]) => {
    const count = await table.count();
    if (count === 0) {
      await table.bulkAdd(defaultData as any);
    }
    return await table.toArray();
  };

  const saveData = async <T>(table: Table<T>, data: T[]) => {
    await table.clear();
    await table.bulkAdd(data as any);
  };

  return {
    db,
    isLoaded,
    setIsLoaded,
    loadData,
    saveData,
  };
};
