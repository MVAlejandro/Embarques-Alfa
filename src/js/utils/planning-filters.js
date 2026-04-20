// Utilidades
import { loadClientsFilter, loadDaysFilter } from './load-select.js';

let allRegisters = [];

// Función para cargar las opciones de filtrado
export async function initPageFilters(getFunction, renderTable) {
    // Cargar filtros con valores iniciales
    loadDaysFilter()

    // Render inicial
    await planningFilter(getFunction, renderTable);

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        planningFilter(getFunction, renderTable);
    });
}

// Función de filtrado por valores seleccionados
export async function planningFilter(getFunction, renderTable) {
    // Verificar que existen los elementos
    const dayFilterEl = document.getElementById('day-filter');
    const clientFilterEl = document.getElementById('client-filter');

    if (!dayFilterEl || !clientFilterEl) return;

    // Tomar valores de los selects
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];
    const clientFilter = clientFilterEl.value;

    // Si no se selecciona un día generar tabla vacía
    if (dayFilterEl.length === 0) {
        renderTable([]);
        return;
    }

    // Obtener registros
    allRegisters = await getFunction();
        if (!allRegisters) return;

    // Filtrar por día seleccionado
    let filtered = allRegisters.filter(p => 
        (dayFilter.length === 0 || dayFilter.includes(p.fecha_programada)));
    
    // Cargar clientes en el select
    loadClientsFilter(filtered, clientFilter)

    filtered = filtered.filter(p => 
        (clientFilter === '0' || p.id_cliente == clientFilter));

    renderTable(filtered);
}