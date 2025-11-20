// Servicios Supabase
import { getOrders } from '../../services/orders-service.js' 
import { getOrderProducts } from '../../services/order-product-service.js';

let allOrders = [];

// Función para crear la tabla y la paginación
export async function renderProductionTable(ordersParam = null) {
    // Obtener órdenes si no se pasa una lista filtrada
    if (ordersParam) {
        allOrders = ordersParam;
    } else {
        allOrders = await getOrders();
    }

    // Ordenar el arreglo completo antes de paginar
    allOrders.sort((a, b) => a.fecha - b.fecha);
    
    const tbody = document.querySelector('#production-table tbody');
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
        if (orden.planta == 'En proceso') {
            statusClass = 'preparation';
        } else if (orden.planta == 'Terminado') {
            statusClass = 'ready';
        } else {
            statusClass = 'canceled';
        }

        // Obtener productos de la orden
        const productos = await getOrderProducts(orden.id_orden);
        // Calcular total de cantidades
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad || 0), 0);

        totalGeneral += totalAmount;

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="production-date fw-bold">${new Date(orden.fecha).toLocaleDateString('es-MX')}</p>
                <p class="production-time">Sin asignar</p>
            </td>
            <td class="production-client p-2">${orden.cliente}</td>
            <td id="production-products-${orden.id_orden}" class="p-2">

            </td>
            <td class="text-center p-2">
                <p class="production-status ${statusClass}">${orden.planta}</p>
            </td>
            <td class="production-control text-center">
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    order-data='${JSON.stringify(orden)}'>
                    Actualizar
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta orden
        const container = document.getElementById(`production-products-${orden.id_orden}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="production-product">${producto.codigo}</p>
            <p class="production-cant fw-bold">Cant. ${producto.cantidad.toLocaleString('en-US')}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center">Tarimas Totales</td>
        <td class="p-2">${totalGeneral.toLocaleString('en-US')}</td>
        <td colspan="2"></td>
    </tr>`;
}
