import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.closest('.filter-wrapper, .dropdown-select');
            if (parent) {
                const input = parent.querySelector('input, select');
                if (input) {
                    input.value = '';
                    const field = action.dataset.field;
                    if (field && state.filters) {
                        state.filters[field] = '';
                    }
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => {
            // Фильтрация по дате (частичное совпадение)
            if (state.date && state.date.trim() !== '') {
                if (!row.date.toLowerCase().includes(state.date.toLowerCase())) {
                    return false;
                }
            }
            
            // Фильтрация по покупателю (частичное совпадение)
            if (state.customer && state.customer.trim() !== '') {
                if (!row.customer.toLowerCase().includes(state.customer.toLowerCase())) {
                    return false;
                }
            }
            
            // Фильтрация по продавцу (точное совпадение из select)
            if (state.seller && state.seller.trim() !== '' && row.seller !== state.seller) {
                return false;
            }
            
            // Фильтрация по диапазону сумм - ВАЖНО: преобразуем строки в числа
            const rowTotal = parseFloat(row.total);
            
            // Проверяем totalFrom (нижняя граница)
            if (state.totalFrom && state.totalFrom.trim() !== '') {
                const minTotal = parseFloat(state.totalFrom);
                if (!isNaN(minTotal) && rowTotal < minTotal) {
                    return false;
                }
            }
            
            // Проверяем totalTo (верхняя граница)
            if (state.totalTo && state.totalTo.trim() !== '') {
                const maxTotal = parseFloat(state.totalTo);
                if (!isNaN(maxTotal) && rowTotal > maxTotal) {
                    return false;
                }
            }
            
            return true;
        });
    };
}