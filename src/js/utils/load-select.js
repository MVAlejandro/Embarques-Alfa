import supabase from "../supabase/supabase-client";
// Servicios Supabase
import { getOrders } from "../services/orders-service";
// Utilidades
import { getDaysOfWeek } from "./week-functions";

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

// Función para cargar semanas en relación a las órdenes registradas
export async function loadWeeksFilter(selectId, fields) {
    const select = document.getElementById(selectId)
    if (!select) return;
    select.innerHTML = '';
    
    // Obtener órdenes
    const allOrders = await getOrders();
    if (!allOrders) return;

    const opciones = allOrders.map(c => {
        if (Array.isArray(fields)) {
            // Combinar varios campos
            return fields.map(f => c[f]).filter(Boolean).join(' - ');
        } else {
            // Solo un campo
            return c[fields];
        }
    });

    // Eliminar duplicados y valores vacíos
    const uniqueOptions = [...new Set(opciones)].filter(v => v);

    // Agregar opciones al select
    select.innerHTML = '<option value="0">Todas</option>';
    uniqueOptions.forEach(opcion => {
        const optionEl = document.createElement('option');
        optionEl.value = opcion;
        optionEl.textContent = opcion;
        select.appendChild(optionEl);
    });
}

// Función para cargar los días de la semana en el filtro
export function loadDaysFilter() {
    const yearEl = document.getElementById('year-filter');
    const weekEl = document.getElementById('week-filter');
    const dayEl = document.getElementById('day-filter');

    if (!yearEl || !weekEl || !dayEl) return;

    const year = parseInt(yearEl.value);
    const week = parseInt(weekEl.value);

    if (!year || !week) {
        dayEl.innerHTML = '<option value="0">Todos</option>';
        return;
    }

    const days = getDaysOfWeek(year, week);

    dayEl.innerHTML = '<option value="0">Todos</option>';
    days.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.date;
        opt.textContent = d.name;
        dayEl.appendChild(opt);
    });
}
