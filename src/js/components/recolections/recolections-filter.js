// Servicios Supabase
import { getRecolections } from '../../services/recolections-service.js'; 
import { renderRecolectionsTable } from './recolections-table.js';
// Utilidades
import { loadOptions, loadDaysFilter } from '../../utils/load-select.js'; 

let allRecolections = [];

document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('supplier-filter', 'emb_proveedores', 'id_proveedor', 'nombre', 'Todos');
    loadDaysFilter()
})

// Función de filtrado por valores seleccionados
export async function recolectionsFilter() {
    // Verificar que existen los elementos
    const supplierFilterEl = document.getElementById('supplier-filter');
    const dayFilterEl = document.getElementById('day-filter');

    if (!supplierFilterEl || !dayFilterEl) return;

    // Tomar valores de los selects
    const supplierFilter = supplierFilterEl.value;
    const dayFilter = dayFilterEl.value ? dayFilterEl.value.split(', ').map(d => d.trim()) : [];

    // Si no se selecciona un día generar tabla vacía
    if (dayFilterEl.length === 0) {
        renderRecolectionsTable([]);
        return;
    }

    // Obtener recolecciones
    allRecolections = await getRecolections();
        if (!allRecolections) return;

    // Filtrar por día y proveedor seleccionado
    const filtered = allRecolections.filter(o => 
        (supplierFilter === '0' || o.id_proveedor == supplierFilter) &&
        (dayFilter.length === 0 || dayFilter.includes(o.fecha_programada)));

    renderRecolectionsTable(filtered);
}
