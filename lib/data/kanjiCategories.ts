import categoriesData from "./kanjiCategories.json";
import joyoMapData from "./kanjiJoyoMap.json";
import { Kanji } from "@/lib/api/kanjiClient";

export interface CategoryMeta {
  id: string;
  name: string;
  nameJp: string;
  type: "jlpt" | "grade" | "curriculum";
  count: number;
  desc: string;
}

export const CATEGORY_META: CategoryMeta[] = categoriesData.categoryMeta as CategoryMeta[];

export const CATEGORY_LISTS: Record<string, string[]> = categoriesData.lists;

export const JOYO_MAP: Record<string, Kanji> = joyoMapData as unknown as Record<string, Kanji>;

export function getCategoryMeta(id: string): CategoryMeta | undefined {
  return CATEGORY_META.find((c) => c.id === id);
}

export function getKanjiListByCategory(categoryId: string): string[] {
  return CATEGORY_LISTS[categoryId] || [];
}

export function getEnrichedKanjiByCategory(categoryId: string): Kanji[] {
  const chars = CATEGORY_LISTS[categoryId] || [];
  return chars.map((c) => JOYO_MAP[c]).filter(Boolean) as Kanji[];
}

