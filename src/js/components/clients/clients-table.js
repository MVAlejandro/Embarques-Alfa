import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { getClients } from '../../services/clients-service.js';
import { validateUserRole } from '../../utils/session-validate.js';

const perPage = 10;
let currentPage = 1;
let allClients = [];

// Función para crear la tabla y la paginación
export async function renderClientsTable(clientsParam = null) {
    // Obtener clientes si no se pasa una lista filtrada
    if (clientsParam) {
        allClients = clientsParam;
    } else {
        allClients = await getClients();
    }
    
    const tbody = document.querySelector('#clients-table tbody');
    const pagination = document.querySelector('#clients-pages .pagination');
    const resultsText = document.getElementById('clients-pages-results');

    // Calcular clientes de la página actual
    const pageStart = (currentPage - 1) * perPage;
    const pageEnd = pageStart + perPage;
    const clients = allClients.slice(pageStart, pageEnd);

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!clients || clients.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay clientes registrados</td></tr>`;
        resultsText.textContent = `Mostrando 0 de ${allClients.length} resultados`;
        pagination.innerHTML = '';
        return;
    }

    clients.forEach(cliente => {
        tbody.innerHTML += 
        `<tr>
            <td class="client-name p-3 ps-4 fw-bold">${cliente.nombre}</td>
            <td class="p-3">
                <p class="client-company fst-italic">${cliente.razon_social}</p>
                <p class="client-rfc">${cliente.rfc}</p>
            </td>
            <td class="p-3">
                <p class="client-email">${cliente.correo}</p>
                <p class="client-phone">${cliente.numero_telefono}</p>
            </td>
            <td class="p-3">
                <p class="client-ubication">${cliente.ubicacion}</p>
                <p class="client-cp">CP: ${cliente.codigo_postal}</p>
            </td>
            <td class="client-controls text-pageEnd p-3 pe-4 d-none" data-vent-only>
                <div class="action-buttons">
                    <button class="btn btn-edit" 
                        data-bs-target="#edit-modal" 
                        data-bs-toggle="modal"
                        client-data='${JSON.stringify(cliente)}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });

    // Actualizar texto de resultados
    const total = allClients.length;
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

            renderClientsTable();
        });
    });
    
    validateUserRole()
}
