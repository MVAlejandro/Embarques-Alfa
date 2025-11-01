// Servicios Supabase
import { getOrders } from '../../services/order-service.js'; 
import { renderOrdersTable } from './orders-table.js';

let allOrders = [];

// Función de filtrado por valores seleccionados
export async function ordersFilter(event) {
    event.preventDefault();

    const typeFilter = document.getElementById('filtro_typeFilter').value;
    const valueFiltered = document.getElementById('filtro_orden').value;

    // Obtener órdenes
    allOrders = await getOrders();
        if (!allOrders) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = typeFilter === '0' && (!valueFiltered || valueFiltered === '0');

    if (filterClean) {
        renderOrdersTable(allOrders);
        return;
    }

    // Aplicar filtros
    const filtered = allOrders.filter(o => {
        let filterOk = true;

        // Filtro por select dinámico
        if (typeFilter !== '0' && valueFiltered !== '0') {
            const campo = o[typeFilter]?.toString().toLowerCase();
            filterOk = campo === valueFiltered.toLowerCase();
        }

        return filterOk;
    });

    renderOrdersTable(filtered);
}

// Función de generación de options en select de filtro
    