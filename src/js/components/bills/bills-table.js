// Servicios Supabase
import { getOrders } from '../../services/orders-service.js' 
import { getOrderProducts } from '../../services/order-product-service.js';

let allOrders = [];

// Función para crear la tabla y la paginación
export async function renderBillsTable(ordersParam = null) {
    // Obtener órdenes si no se pasa una lista filtrada
    if (ordersParam) {
        allOrders = ordersParam;
    } else {
        allOrders = await getOrders();
    }

    // Ordenar el arreglo completo antes de paginar
    allOrders.sort((a, b) => a.fecha - b.fecha);
    
    const tbody = document.querySelector('#bills-table tbody');
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
        if (orden.facturacion == 'Pendiente') {
            statusClass = 'preparation';
        } else if (orden.facturacion == 'Facturado') {
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
            <td class="bill-date fw-bold p-2 ps-4">${new Date(orden.fecha).toLocaleDateString('es-MX')}</td>
            <td class="p-2">
                <p class="bill-oc fw-bold">OC-${orden.numero_orden}</p>
                <p class="bill-contract">#${orden.numero_contrato}</p>
            </td>
            <td class="bill-client p-2">${orden.cliente}</td>
            <td id="bill-products-${orden.id_orden}" class="p-2">
                
            </td>
            <td class="text-center p-2">
                <p class="bill-status ${statusClass}">${orden.facturacion}</p>
            </td>
            <td class="bill-control text-center">
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    order-data='${JSON.stringify(orden)}'>
                    Actualizar
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta orden
        const container = document.getElementById(`bill-products-${orden.id_orden}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="bill-product">${producto.codigo}</p>
            <p class="bill-cant fw-bold">Cant. ${producto.cantidad.toLocaleString('en-US')}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="3" class="text-center">Tarimas Totales</td>
        <td class="p-2">${totalGeneral.toLocaleString('en-US')}</td>
        <td colspan="2"></td>
    </tr>`;
}
