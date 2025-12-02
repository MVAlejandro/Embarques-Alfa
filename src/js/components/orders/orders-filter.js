// Servicios Supabase
import { getOrders } from '../../services/orders-service.js'; 
import { renderOrdersTable } from './orders-table.js';
// Utilidades
import { loadOptions, loadWeeksFilter } from '../../utils/load-select.js';

let allOrders = [];

// Cargar las opciones de filtrado al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadWeeksFilter('week-filter', ['anio', 'semana']);
    loadOptions('client-filter', 'emb_clientes', 'id_cliente', 'nombre', 'Todos')
})

// Función de filtrado por valores seleccionados
export async function ordersFilter() {
    const weekFilter = document.getElementById('week-filter').value;
    const clientFiltered = document.getElementById('client-filter').value;
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();

    // Obtener órdenes
    allOrders = await getOrders();
        if (!allOrders) return;

    // Ordenar por fecha
    allOrders.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Si no hay filtros activos, mostrar todo
    const filterClean = weekFilter === '0' && clientFiltered === '0' && searchText === '';

    if (filterClean) {
        renderOrdersTable(allOrders);
        return;
    }

    // Aplicar filtros
    const filtered = allOrders.filter(o => {
        const weekOk = weekFilter === '0' || `${o.anio} - ${o.semana}` == weekFilter;
        const clientOk = clientFiltered === '0' || o.id_cliente == clientFiltered;
        const textOk = searchText === '' || o.numero_orden?.toString().includes(searchText) 
        return weekOk && clientOk && textOk;
    });

    renderOrdersTable(filtered);
}
