// Servicios Supabase
import { getSession, getUserProfile } from '../../services/login-service.js';
import { getPartitions } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];

// Función para crear la tabla y la paginación
export async function renderProductionTable(partitionsParam = null) {
    // Obtener partidas si no se pasa una lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    } else {
        allPartitions = await getPartitions();
    }
    
    const tbody = document.querySelector('#production-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    let totalTarimas = 0;
    let totalMarcos = 0;
    let totalCancelado = 0;

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;
    
    for (const partida of allPartitions) {
        // Determinar clase CSS para el estatus
        let statusClass = '';
        if (partida.planta == 'En proceso') {
            statusClass = 'yellow';
        } else if (partida.planta == 'PT parcial') {
            statusClass = 'greenL';
        } else if (partida.planta == 'En secado') {
            statusClass = 'blue';
        } else if (partida.planta == 'Terminado') {
            statusClass = 'greenD';
        } else if (partida.planta == 'Cancelado') {
            statusClass = 'red';
        } else {
            statusClass = 'grey';
        }

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="production-date fw-bold">${partida.fecha_programada}</p>
                <p class="production-time">${partida.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="production-client p-2">${partida.cliente}</td>
            <td id="production-products-${partida.id_partida}" class="p-2">

            </td>
            <td class="text-center p-2">
                <p class="production-status ${statusClass}">${partida.planta}</p>
            </td>
            <td class="production-observations p-2">${partida.observaciones}</td>
            <td class="production-control text-center d-none" data-prod-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.planta === "Terminado" || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.planta === "Terminado" ? "Completado" : partida.planta === "Cancelado" ? "Cancelado" :"Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos solicitados de esta partida
        const requestedContainer = document.getElementById(`production-products-${partida.id_partida}`);
        requestedContainer.innerHTML = '';

        let tarimas = 0;
        let marcos = 0;
        let cancelados = 0;

        for (const producto of productos) {
            if (partida.planta !== "Cancelado") {
                if (producto.producto?.includes('TARIMA')) {
                    const cantidad = producto.cantidad_embarcada || 0;
                    tarimas += cantidad;
                    totalTarimas += cantidad;
                } 
                else if (producto.producto?.includes('MARCO')) {
                    const cantidad = producto.cantidad_embarcada || 0;
                    marcos += cantidad;
                    totalMarcos += cantidad;
                }

            } else if ((partida.planta === "Cancelado")) {
                const cantidad = producto.cantidad_solicitada || 0;
                cancelados += cantidad;
                totalCancelado += cantidad;
            }

            requestedContainer.innerHTML += 
            `<p class="shipment-product">${producto.codigo} - <b>Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="shipment-cant">${producto.producto}</p>
            <hr>`;
        }
    };

    // Agregar fila de total al final
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
