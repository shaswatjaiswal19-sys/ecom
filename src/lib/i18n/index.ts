import { en } from "./en";
import { hi } from "./hi";
import { I18nDictionary, Language } from "./types";

export * from "./types";
export * from "./utils";
export { en, hi };

export const dictionaries: Record<Language, I18nDictionary> = {
  en,
  hi,
};

export function getDictionary(lang: Language): I18nDictionary {
  return dictionaries[lang] || dictionaries.en;
}
