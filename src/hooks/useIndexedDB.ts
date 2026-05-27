import { useState } from "react";
import Dexie, { type Table } from "dexie";
import type { Resource, Recipe, Profession, KamasGoal, CatalogPrice } from "../types";
import type { DofusPrice } from "../types/dofus";
import type { BankSession } from "../types/bank";

interface DofusDB extends Dexie {
  resources: Table<Resource>;
  recipes: Table<Recipe>;
  professions: Table<Profession>;
  goals: Table<KamasGoal & { id: string }>;
  catalogPrices: Table<CatalogPrice>;
  dofusPrices: Table<DofusPrice>;
  bankSession: Table<BankSession>;
}

export const db = new Dexie("DofusRetroCraftDB") as DofusDB;

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

// v4 : ajout du catalogue de prix de ressources
db.version(4).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
  catalogPrices: "id",
});

// v8 : ajout du store bankSession
db.version(8).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
  catalogPrices: "id",
  dofusPrices: "id",
  bankSession: "id",
});

// v7 : ajout du store dofusPrices
db.version(7).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
  catalogPrices: "id",
  dofusPrices: "id",
});

// v6 : rechargement recettes depuis recipesCatalog + fix typo minor → miner
db.version(6).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
  catalogPrices: "id",
}).upgrade(async tx => {
  await tx.table('recipes').clear();
  await tx.table('professions').where('id').equals('minor').modify({ id: 'miner' });
});

// v5 : migration id catalogPrices string → number
db.version(5).stores({
  resources: "id, name, type",
  recipes: "id, name, profession, level",
  professions: "id, name, currentLevel",
  goals: "id",
  catalogPrices: "id",
}).upgrade(async tx => {
  const old = await tx.table<{ id: string; price: number }>('catalogPrices').toArray();
  await tx.table('catalogPrices').clear();
  if (old.length > 0) {
    await tx.table('catalogPrices').bulkAdd(
      old.map(row => ({ id: Number(row.id), price: row.price })),
    );
  }
});

export const useIndexedDB = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const loadData = async <T>(table: Table<T>, defaultData: T[]) => {
    const count = await table.count();
    if (count === 0) {
      await table.bulkAdd(defaultData);
    }
    return await table.toArray();
  };

  const saveData = async <T>(table: Table<T>, data: T[]) => {
    await table.clear();
    await table.bulkAdd(data);
  };

  return {
    db,
    isLoaded,
    setIsLoaded,
    loadData,
    saveData,
  };
};
