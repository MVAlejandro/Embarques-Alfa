import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { getUnits, getBoxes } from '../../services/units-service.js';
import { validateUserRole } from '../../utils/session-validate.js';

const perPage = 10;
let currentPage = 1;
let allUnits = [];

// Función para crear la tabla y la paginación
export async function renderUnitsTable(unitsParam = null) {
    // Obtener unidades y cajas si no se pasa una lista filtrada
    if (unitsParam) {
        allUnits = unitsParam;
    } else {
        const [units, boxes] = await Promise.all([ getUnits(), getBoxes() ]);

        allUnits = [
            ...units.map(u => ({ ...u, tipo: u.tipo })),
            ...boxes.map(b => ({ ...b, tipo: "Caja" }))
        ];
    }

    // Ordenar el arreglo completo antes de paginar
    allUnits.sort((a, b) => a.id_unidad - b.id_unidad);
    
    const tbody = document.querySelector('#units-table tbody');
    const pagination = document.querySelector('#units-pages .pagination');
    const resultsText = document.getElementById('units-pages-results');

    // Calcular unites de la página actual
    const pageStart = (currentPage - 1) * perPage;
    const pageEnd = pageStart + perPage;
    const units = allUnits.slice(pageStart, pageEnd);

    // Limpiar tabla antes de insertar
    tbody.innerHTML = '';

    if (!units || units.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay unidades registradas</td></tr>`;
        resultsText.textContent = `Mostrando 0 de ${allUnits.length} resultados`;
        pagination.innerHTML = '';
        return;
    }

    units.forEach(unidad => {
        tbody.innerHTML += 
        `<tr>
            <td class="unit-type p-3 ps-4">${unidad.tipo}</td>
            <td class="unit-name p-3">${unidad.nombre}</td>
            <td class="unit-license p-3">${unidad.placas}</td>
            <td class="unit-policy p-3">#${unidad.numero_poliza}</td>
            <td class="unit-description p-3">${unidad.descripcion}</td>
            <td class="unit-controls text-pageEnd p-3 pe-4 d-none" data-trans-only>
                <div class="action-buttons">
                    <button class="btn btn-edit" 
                        data-bs-target="#edit-modal" 
                        data-bs-toggle="modal"
                        unit-data='${JSON.stringify(unidad)}'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>`;
    });

    // Actualizar texto de resultados
    const total = allUnits.length;
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

            renderUnitsTable();
        });
    });
    
    validateUserRole()
}
