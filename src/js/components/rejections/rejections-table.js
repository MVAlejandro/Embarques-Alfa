// Servicios Supabase
import { getRejections } from '../../services/rejections-service.js'; 
import { getRejectionProducts } from '../../services/rejection-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allRejections = [];

// Función para crear la tabla y la paginación
export async function renderRejectionsTable(rejectionsParam = null) {
    // Obtener rechazos si no se pasa una lista filtrada
    if (rejectionsParam) {
        allRejections = rejectionsParam;
    } else {
        allRejections = await getRejections();
    }
    
    const tbody = document.querySelector('#rejections-table tbody');
    const thead = document.getElementById('rejections-total-container');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (!allRejections || allRejections.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="7">No hay rechazos registrados</td></tr>`;
        return;
    }

    let totalTarimas = 0;
    let totalMarcos = 0;

    weekText.innerHTML = `Semana ${allRejections[0].semana}`;
    
    for (const rechazo of allRejections) {
        let statusClass = '';
        if (rechazo.estado == 'Atendido') {
            statusClass = 'yellow';
        } else if (rechazo.estado == 'Verificado') {
            statusClass = 'blue';
        } else if (rechazo.estado == 'Cerrado') {
            statusClass = 'greenD';
        } else if (rechazo.estado == 'Cancelado') {
            statusClass = 'red';
        } else {
            statusClass = 'grey';
        }

        // Obtener productos del rechazo
        const productos = await getRejectionProducts(rechazo.id_rechazo);

        tbody.innerHTML += 
        `<tr>
            <td class="rejection-date fw-bold px-3 py-2 ps-3">${rechazo.fecha_rechazo}</td>
            <td class="px-3 py-2">
                <p class="rejection-oc fw-bold">OC-${rechazo.numero_orden}</p>
                <p class="rejection-contract">Contrato #${rechazo.numero_contrato}</p>
            </td>
            <td class="rejection-client px-3 py-2">${rechazo.cliente}</td>
            <td id="rejection-products-${rechazo.id_rechazo}" class="px-3 py-2">

            </td>
            <td class="text-center px-3 py-2">
                <p class="rejection-status ${statusClass}">${rechazo.estado}</p>
            </td>
            <td class="rejection-control text-center d-none" data-vent-only data-dir-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${rechazo.embarque === "Cerrado" || rechazo.estado === "Cancelado" ? "disabled" : ""}
                    rejection-data='${JSON.stringify(rechazo)}'>
                    ${rechazo.estado === "Cerrado" ? "Cerrado" : rechazo.estado === "Cancelado" ? "Cancelado" :"Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta rechazo
        const container = document.getElementById(`rejection-products-${rechazo.id_rechazo}`);
        container.innerHTML = '';

        let tarimas = 0;
        let marcos = 0;
        let cancelados = 0;

        for (const producto of productos) {
            if (rechazo.estado !== "Cancelado") {
                if (producto.producto?.includes('TARIMA')) {
                    const cantidad = producto.cantidad_rechazada || 0;
                    tarimas += cantidad;
                    totalTarimas += cantidad;
                } 
                else if (producto.producto?.includes('MARCO')) {
                    const cantidad = producto.cantidad_rechazada || 0;
                    marcos += cantidad;
                    totalMarcos += cantidad;
                }

            } else if ((rechazo.estado === "Cancelado")) {
                const cantidad = producto.cantidad_rechazada || 0;
                cancelados += cantidad;
                totalCancelado += cantidad;
            }

            container.innerHTML += 
            `<p class="rejection-product">${producto.codigo} - <b>Cant. ${(producto.cantidad_rechazada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="rejection-cant">${producto.producto}</p>
            <hr>`;
        }
    };

    // Agregar fila de total al inicio y al final
    thead.innerHTML =
        `<table class="text-center container-fluid">
            <tbody>
                <tr>
                    <td class="fw-bold">TOTALES</td>
                    <td><b>Tarimas: </b>${totalTarimas.toLocaleString('en-US')} pz</td>
                    <td><b>Marcos: </b>${totalMarcos.toLocaleString('en-US')} pz</td>
                    <td><b>Cancelado: </b>${totalCancelado.toLocaleString('en-US')} pz</td>
                </tr>    
            </tbody>
        </table>`;

    tbody.innerHTML += 
        `<tr class="table-active">
            <td></td>
            <td colspan="4">
                <table class="text-center container-fluid">
                    <tbody>
                        <tr>
                            <td class="fw-bold">TOTALES</td>
                            <td><b>Tarimas: </b>${totalTarimas.toLocaleString('en-US')} pz</td>
                            <td><b>Marcos: </b>${totalMarcos.toLocaleString('en-US')} pz</td>
                            <td><b>Cancelado: </b>${totalCancelado.toLocaleString('en-US')} pz</td>
                        </tr>    
                    </tbody>
                </table>
            </td>
            <td></td>
        </tr>`;

    validateUserRole()
}
