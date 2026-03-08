import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(
        { skipEmptyTargetValues: true },
        [
            rules.searchMultipleFields(
                searchField,
                ["date", "customer", "seller"],
                false
            )
        ]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        // Получаем значение поиска
        const searchValue = state?.filters?.[searchField] || 
                           state?.search || 
                           action?.payload?.search || 
                           '';
        
        // Если поиск пустой или undefined, возвращаем все данные
        if (!searchValue || searchValue.trim() === '') {
            return data;
        }
        
        // Применяем компаратор
        return data.filter(row => {
            // Проверяем каждое поле на наличие поисковой строки
            const searchLower = searchValue.toLowerCase();
            
            return (
                row.date.toLowerCase().includes(searchLower) ||
                row.customer.toLowerCase().includes(searchLower) ||
                row.seller.toLowerCase().includes(searchLower)
            );
        });
    };
}