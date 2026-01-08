// Servicios Supabase
import { getPartitions } from '../services/partitions-service.js'; 
// Utilidades
import { loadOptions, loadDaysFilter } from './load-select.js';

let allPartitions = [];

// Función para cargar las opciones de filtrado
export async function initPageFilters(renderTable) {
    // Cargar filtros con valores iniciales
    loadOptions('client-filter', 'emb_clientes', 'id_cliente', 'nombre', 'Todos');
    loadDaysFilter()

    // Render inicial
    await planningFilter(renderTable);

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        planningFilter(renderTable);
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
    if (!dayFilterEl) {
        renderTable([]);
        return;
    }

    // Obtener órdenes
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por día y cliente seleccionado
    const filtered = allPartitions.filter(o => 
        (clientFilter === '0' || o.id_cliente == clientFilter) &&
        (dayFilter.length === 0 || dayFilter.includes(o.fecha_programada)));

    renderTable(filtered);
}
