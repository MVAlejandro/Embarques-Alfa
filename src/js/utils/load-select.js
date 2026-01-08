import supabase from "../supabase/supabase-client";
// Servicios Supabase
import { getOrders } from "../services/orders-service";

// Función para cargar datos completos en los select del formulario
export async function loadOptions(selectId, table, valueKey, textKey, defaultOption, selectedValue = '0') {
    const select = document.getElementById(selectId);
    if (selectedValue == null) selectedValue = '0';

    select.innerHTML = '';

    // Crear opción por defecto 
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = defaultOption;
    select.appendChild(defaultOptionEl);

    const { data, error } = await supabase
        .from(table)
        .select(`${valueKey}, ${textKey}`);

    if (error) {
        console.error(`Error cargando ${table}:`, error);
        return;
    }

    // Crear y seleccionar opciones
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];

        // Si el valor coincide, marcar como seleccionado
        if (option.value == selectedValue) {
            option.selected = true;
        }

        select.appendChild(option);
    });
}

// Función para cargar datos en relación a campos registrados
export async function loadOptionsFilter(selectId, getFunction, displayFields, idField, defaultOption, selectedId = 0) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Limpiar contenido previo
    select.innerHTML = '';

    // Obtener datos externos
    const data = await getFunction();
    if (!data) return;

    // Opción por defecto
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = defaultOption;
    select.appendChild(defaultOptionEl);

    // Eliminar duplicados por texto
    const seenTexts = new Set();

    // Agregar opciones al select
    data.forEach(item => {
        let text;
        if (Array.isArray(displayFields)) {
            text = displayFields.map(f => item[f]).filter(Boolean).join(' - ');
        } else {
            text = item[displayFields];
        }

        if (!text || seenTexts.has(text)) return;
        seenTexts.add(text);

        const optionEl = document.createElement('option');
        optionEl.value = item[idField];
        optionEl.textContent = text;

        // Marcar como seleccionado si coincide con selectedId
        if (item[idField] == selectedId) {
            optionEl.selected = true;
        }

        select.appendChild(optionEl);
    });
}

// Función para cargar los días de la semana en el filtro
export function loadDaysFilter() {
    flatpickr("#day-filter", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "multiple",
        dateFormat: "Y-m-d",
        defaultDate: new Date(),
        disable: [
            date => date.getDay() === 0
        ]
    });
}
