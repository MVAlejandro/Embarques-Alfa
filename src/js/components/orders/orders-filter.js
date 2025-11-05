// Servicios Supabase
import { getOrders } from '../../services/order-service.js'; 
import { renderOrdersTable } from './orders-table.js';
// Utilidades
import { loadOptions } from '../../utils/load-select.js';

let allOrders = [];

// Cargar las opciones de filtrado al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('client-filter', 'emb_clientes', 'id_cliente', 'nombre')
})

// Función de filtrado por valores seleccionados
export async function ordersFilter(event) {
    event.preventDefault();

    const dateStartIn = document.getElementById('date-start-filter').value;
    const dateEndIn = document.getElementById('date-end-filter').value;
    const clientFiltered = document.getElementById('client-filter').value;

    // Obtener órdenes
    allOrders = await getOrders();
        if (!allOrders) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = !dateStartIn && !dateEndIn && clientFiltered === '0';

    if (filterClean) {
        renderOrdersTable(allOrders);
        return;
    }

    const dateStart = dateStartIn ? new Date(dateStartIn) : new Date(NaN);
    const dateEnd = dateEndIn ? new Date(dateEndIn) : new Date(NaN);

    // Ordenar por fecha
    allOrders.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Aplicar filtros
    const filtered = allOrders.filter(o => {
        const cumpleFechas = (!isNaN(dateStart) ? new Date(o.fecha) >= dateStart : true) &&
                             (!isNaN(dateEnd) ? new Date(o.fecha) <= dateEnd : true);
        const cumpleCliente = clientFiltered === '0' || o.id_cliente == clientFiltered;
        return cumpleFechas && cumpleCliente;
    });

    renderOrdersTable(filtered);
}
