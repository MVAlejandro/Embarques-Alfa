// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js';
import { renderShipmentsTable } from './shipments-table.js';

let allPartitions = [];

// Función para cargar las opciones de filtrado
export async function initShipmentsFilters() {
    // Cargar filtros con valores iniciales
    flatpickr("#day-filter", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        disableMobile: true,
        dateFormat: "Y-m-d",
        defaultDate: new Date()
    });

    // Render inicial
    await shipmentsFilter();

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        shipmentsFilter();
    });
}

// Función de filtrado por valores seleccionados
export async function shipmentsFilter() {
    const dayFilter = document.getElementById('day-filter').value;

    // Si no se selecciona un día generar tabla vacía
    if (!dayFilter) {
        renderShipmentsTable([]);
        return;
    }

    // Obtener registros
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por proyectados
    allPartitions = allPartitions.filter(p => (p.embarque !== "Proyectado"));

    // Aplicar filtros
    const filtered = allPartitions.filter(p => {
        // Filtro por búsqueda de nombre
        const dateOk = dayFilter === '' || p.fecha_programada == dayFilter;

        return dateOk;
    });
        
    renderShipmentsTable(filtered);
}