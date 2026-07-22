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
    const supplierFilter = document.getElementById('supplier-filter').value;
    const dayFilter = document.getElementById('day-filter');

    let startDate = null;
    let endDate = null;

    if (dayFilter?.value) {
        const range = dayFilter.value.split(' a ');
        startDate = range[0];                 
        endDate = range[1] || range[0];
    }

    // Si no se selecciona un día generar tabla vacía
    if (!startDate) {
        renderTable([]);
        return;
    }

    // Obtener recolecciones
    allRecolections = await getRecolections();
        if (!allRecolections) return;

    // Filtrar por día y proveedor seleccionado
    const filtered = allRecolections.filter(o => {
        let dateOk = true;
        if (startDate) {
            const fecha = o.fecha_programada.slice(0, 10);
            dateOk = fecha >= startDate && fecha <= endDate;
        }
        const supplierOk = supplierFilter === '0' || o.id_proveedor == supplierFilter;

        return dateOk && supplierOk;
    });

    renderRecolectionsTable(filtered);
}
