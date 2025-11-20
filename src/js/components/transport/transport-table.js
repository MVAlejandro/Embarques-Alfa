// Servicios Supabase
import { getOrders } from '../../services/orders-service.js' 
import { getOrderProducts } from '../../services/order-product-service.js';

let allOrders = [];

// Función para crear la tabla y la paginación
export async function renderTransportTable(ordersParam = null) {
    // Obtener órdenes si no se pasa una lista filtrada
    if (ordersParam) {
        allOrders = ordersParam;
    } else {
        allOrders = await getOrders();
    }

    // Ordenar el arreglo completo antes de paginar
    allOrders.sort((a, b) => a.fecha - b.fecha);
    
    const tbody = document.querySelector('#transport-table tbody');
    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!allOrders || allOrders.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay órdenes registradas</td></tr>`;
        return;
    }

    let totalGeneral = 0;

    for (const orden of allOrders) {
        // Determinar clase CSS para la diferencia
        let statusClass = '';
        if (orden.transporte == 'Sin asignar') {
            statusClass = 'canceled';
        } else if (orden.transporte == 'Asignado') {
            statusClass = 'ready';
        }

        // Obtener productos de la orden
        const productos = await getOrderProducts(orden.id_orden);
        // Calcular total de cantidades
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad || 0), 0);

        totalGeneral += totalAmount;

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="transport-date fw-bold">${new Date(orden.fecha).toLocaleDateString('es-MX')}</p>
                <p class="transport-time">Sin asignar</p>
            </td>
            <td class="transport-client p-2">${orden.cliente}</td>
            <td class="transport-cant fw-bold p-2">Cant. ${totalAmount}</td>
            <td class="text-center p-2">
                <p class="transport-status ${statusClass}">${orden.transporte}</p>
            </td>
            <td class="transport-unit p-2">${orden.unidad || "Sin Asignar"}</td>
            <td class="transport-control text-center">
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    order-data='${JSON.stringify(orden)}'>
                    Asignar
                </button>
            </td>
        </tr>`;
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center">Tarimas Totales</td>
        <td class="p-2">${totalGeneral.toLocaleString('en-US')}</td>
        <td colspan="3"></td>
    </tr>`;
}
