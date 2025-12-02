import supabase from "../supabase/supabase-client.js";
// Servicios Supabase
import { getPartitions } from "../services/partitions-service.js"; 
import { planningFilter } from "./planning-filters.js";

// Función para obtener la última semana registrada de órdenes
export async function obtainLastWeek() {
    const { data, error } = await supabase
        .from('emb_partidas')
        .select('semana, anio')
        .order('anio', { ascending: false })
        .order('semana', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error obteniendo última semana:', error);
        return null;
    }

    return data?.[0] || null;
}

// Función para obtener las semanas disponibles por año
export async function buildWeeksByYear() {
    const allPartitions = await getPartitions();
    const weeksByYear = {};

    allPartitions.forEach(c => {
        const { anio, semana } = c;
        if (!weeksByYear[anio]) weeksByYear[anio] = new Set();
        weeksByYear[anio].add(semana);
    });

    return weeksByYear;
}

// Función para calcular los días de la semana seleccionada
export function getDaysOfWeek(year, week) {
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const dayOfWeek = simple.getDay(); // 0 = Dom,1 = Lun,... 6 = Sab
    const monday = new Date(simple);
    // Ignorar domingo
    const diff = dayOfWeek <= 0 ? 1 - dayOfWeek : 1 - dayOfWeek;
    monday.setDate(simple.getDate() + diff);

    const days = [];
    for (let i = 0; i < 6; i++) { // Lunes a Sábado
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const formatted = `${yyyy}-${mm}-${dd}`;
        const dayName = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][i];
        days.push({ date: formatted, name: dayName });
    }
    return days;
}

export function weekNavigation(direction, weeksByYear, renderTable, statusField) {
    const yearFilter = document.getElementById('year-filter');
    const weekFilter = document.getElementById('week-filter');

    let anio = parseInt(yearFilter.value);
    let semana = parseInt(weekFilter.value);

    if (!anio || !semana) return;

    const actualWeeks = Array.from(weeksByYear[anio]).sort((a, b) => a - b);
    const actualId = actualWeeks.indexOf(semana);
    const newId = actualId + direction;

    const updateContent = () => {
        // Simular "submit" para disparar el filtrado y renderizado
        planningFilter(renderTable, statusField)
    };

    // Movimiento dentro del mismo año
    if (newId >= 0 && newId < actualWeeks.length) {
        weekFilter.value = actualWeeks[newId];
        updateContent();
    }

    // Si retrocede más allá de la primera semana regresar al año anterior
    else if (newId < 0) {
        const orderedYears = Object.keys(weeksByYear).map(Number).sort((a, b) => a - b);
        const idxAnio = orderedYears.indexOf(anio);

        if (idxAnio > 0) {
            const newYear = orderedYears[idxAnio - 1];
            const newWeeksByYear = Array.from(weeksByYear[newYear]).sort((a, b) => a - b);

            yearFilter.value = newYear;
            setTimeout(() => {
                weekFilter.value = newWeeksByYear[newWeeksByYear.length - 1];
                updateContent();
            }, 100);
        }
    }

    // Si avanza más allá de la última semana pasar al siguiente año
    else if (newId >= actualWeeks.length) {
        const orderedYears = Object.keys(weeksByYear).map(Number).sort((a, b) => a - b);
        const idxAnio = orderedYears.indexOf(anio);

        if (idxAnio < orderedYears.length - 1) {
            const newYear = orderedYears[idxAnio + 1];
            const newWeeksByYear = Array.from(weeksByYear[newYear]).sort((a, b) => a - b);

            yearFilter.value = newYear;
            setTimeout(() => {
                weekFilter.value = newWeeksByYear[0];
                updateContent();
            }, 100);
        }
    }
}
