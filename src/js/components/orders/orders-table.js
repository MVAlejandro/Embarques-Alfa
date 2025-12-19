import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { getOrders } from '../../services/orders-service.js' 
import { getOrderProducts } from '../../services/order-product-service.js';
import { validateUserRole } from '../../utils/session-validate.js';

const perPage = 10;
let currentPage = 1;
let allOrders = [];

// Función para crear la tabla y la paginación
export async function renderOrdersTable(ordersParam = null) {
    // Obtener órdenes si no se pasa una lista filtrada
    if (ordersParam) {
        allOrders = ordersParam;
    } else {
        allOrders = await getOrders();
    }

    // Ordenar el arreglo completo antes de paginar
    allOrders.sort((a, b) => a.id_orden - b.id_orden);
    
    const tbody = document.querySelector('#orders-table tbody');
    const pagination = document.querySelector('#orders-pages .pagination');
    const resultsText = document.getElementById('orders-pages-results');

    // Calcular órdenes de la página actual
    const pageStart = (currentPage - 1) * perPage;
    const pageEnd = pageStart + perPage;
    const orders = allOrders.slice(pageStart, pageEnd);

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!orders || orders.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay órdenes registradas</td></tr>`;
        resultsText.textContent = `Mostrando 0 de ${allOrders.length} resultados`;
        pagination.innerHTML = '';
        return;
    }

    for (const orden of orders) {
        // Obtener productos de la orden
        const productos = await getOrderProducts(orden.id_orden);

        // Calcular total de cantidades
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_orden || 0), 0);

        tbody.innerHTML += 
        `<tr>
            <td class="order-id fw-bold p-3 ps-4">OC-${orden.numero_orden}</td>
            <td class="order-contract p-3">#${orden.numero_contrato}</td>
            <td class="p-3">
                <p class="order-client">${orden.cliente}</p>
                <p class="order-client-email">${orden.correo}</p>
            </td>
            <td class="order-date p-3">${orden.fecha}</td>
            <td id="order-products-${orden.id_orden}" class="p-2">
                
            </td>
            <td class="order-controls text-end p-3 pe-4 d-none" data-vent-only>
                <div class="action-buttons">
                    <button class="btn btn-edit" 
                        data-bs-target="#edit-modal" 
                        data-bs-toggle="modal"
                        order-data='${JSON.stringify(orden)}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                    <button class="btn btn-delete" 
                        data-bs-target="#delete-modal" 
                        data-bs-toggle="modal"
                        data-id='${orden.id_orden}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;

        // Insertar productos de esta orden
        const container = document.getElementById(`order-products-${orden.id_orden}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="order-product">${producto.codigo} - <b> Cant. ${producto.cantidad_orden.toLocaleString('en-US')}</b></p>
            <p class="order-cant">${producto.producto}</p>
            <hr>`;
        };

        container.innerHTML += 
        `<p class="order-amount fw-bold">TOTAL: ${totalAmount}</p>`;
    };

    // Actualizar texto de resultados
    const total = allOrders.length;
    resultsText.textContent = `Mostrando ${Math.min(pageStart + 1, total)} a ${Math.min(pageEnd, total)} de ${total} resultados`;

    // Crear paginación
    const totalPages = Math.ceil(total / perPage);
    pagination.innerHTML = '';

    const maxVisible = 4; // máximo de botones visibles
    let startPage = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let endPage = startPage + maxVisible - 1;
    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    // Botón Anterior
    pagination.innerHTML += 
        `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}" data-page="prev">
            <a class="page-link" href="#">&laquo;</a>
        </li>`;

    // Primera página + ...
    if (startPage > 1) {
        pagination.innerHTML += 
            `<li class="page-item" data-page="1"><a class="page-link" href="#">1</a></li>`;
        if (startPage > 2) {
            pagination.innerHTML += 
                `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Botones centrales
    for (let i = startPage; i <= endPage; i++) {
        pagination.innerHTML += 
            `<li class="page-item ${i === currentPage ? 'active' : ''}" data-page="${i}">
                <a class="page-link" href="#">${i}</a>
            </li>`;
    }

    // Última página + ...
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pagination.innerHTML += 
                `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        pagination.innerHTML += 
            `<li class="page-item" data-page="${totalPages}"><a class="page-link" href="#">${totalPages}</a></li>`;
    }

    // Botón Siguiente
    pagination.innerHTML += 
        `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}" data-page="next">
            <a class="page-link" href="#">&raquo;</a>
        </li>`;

    // Añadir los eventos de clic a la paginación
    pagination.querySelectorAll('.page-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            const type = item.dataset.page;

            if (type === 'prev' && currentPage > 1) {
                currentPage--;
            } else if (type === 'next' && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(parseInt(type))) {
                currentPage = parseInt(type);
            }

            renderOrdersTable();
        });
    });
    
    validateUserRole()
}