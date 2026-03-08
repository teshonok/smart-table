import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор

  const compare = createComparison(
    { skipEmptyTargetValues: true }, // Объект с одной настройкой
    [
      // Массив правил
      rules.searchMultipleFields(
        searchField,
        ["date", "customer", "seller"],
        false,
      ),
    ],
  );

  return (data, state, action) => {
      // @todo: #5.2 — применить компаратор

      // 1. Получаем значение поиска
      const searchValue =
        state?.filters?.[searchField] || action?.payload?.search || "";

      // 2. Применяем поиск или возвращаем исходные данные
      return searchValue ? compare(data, state) : data;
    
  };
}
