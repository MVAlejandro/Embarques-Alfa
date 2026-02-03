// Servicios Supabase
import { getPartitions } from '../services/partitions-service.js'; 
import { getTrips } from '../services/trips-service.js';
// Utilidades
import { loadOptions, loadDaysFilter } from './load-select.js';

let allPartitions = [];
let allTrips = [];

// Función para cargar las opciones de filtrado
export async function initPageFilters(filterFunction, renderTable) {
    // Cargar filtros con valores iniciales
    loadOptions('client-filter', 'emb_clientes', 'id_cliente', 'nombre', 'Todos');
    loadDaysFilter()

    // Render inicial
    await filterFunction(renderTable);

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        filterFunction(renderTable);
    });
}

// Función de filtrado por valores seleccionados
export async function planningFilter(renderTable) {
    // Verificar que existen los elementos
    const clientFilterEl = document.getElementById('client-filter');
    const dayFilterEl = document.getElementById('day-filter');

    if (!clientFilterEl || !dayFilterEl) return;

    // Tomar valores de los selects
    const clientFilter = clientFilterEl.value;
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    // Si no se selecciona un día generar tabla vacía
    if (dayFilterEl.length === 0) {
        renderTable([]);
        return;
    }

    // Obtener órdenes
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por día y cliente seleccionado
    const filtered = allPartitions.filter(p => 
        (clientFilter === '0' || p.id_cliente == clientFilter) &&
        (dayFilter.length === 0 || dayFilter.includes(p.fecha_programada)));

    renderTable(filtered);
}

// Función de filtrado por valores seleccionados
export async function tripsFilter(renderTable) {
    // Verificar que existen los elementos
    const clientFilterEl = document.getElementById('client-filter');
    const dayFilterEl = document.getElementById('day-filter');

    if (!clientFilterEl || !dayFilterEl) return;

    // Tomar valores de los selects
    const clientFilter = clientFilterEl.value;
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    // Si no se selecciona un día generar tabla vacía
    if (dayFilterEl.length === 0) {
        renderTable([]);
        return;
    }

    // Obtener órdenes
    allTrips = await getTrips();
        if (!allTrips) return;

    // Filtrar por día y cliente seleccionado
    const filtered = allTrips.filter(t => 
        (clientFilter === '0' || t.id_cliente == clientFilter) &&
        (dayFilter.length === 0 || dayFilter.includes(t.fecha_programada)));

    renderTable(filtered);
}
