// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];

// Función para crear la tabla y la paginación
export async function renderPartitionsTable(partitionsParam = null) {
    // Obtener partidas si no se pasa una lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    } else {
        allPartitions = await getPartitions();
    }
    
    const tbody = document.querySelector('#partitions-table tbody');
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
        let statusClass = '';
        if (partida.planta == 'En proceso') {
            statusClass = 'yellow';
        } else if (partida.planta == 'PT parcial') {
            statusClass = 'greenL';
        } else if (partida.planta == 'En secado' || partida.planta == 'Proyectado') {
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
            <td class="p-2 ps-3">
                <p class="partition-date fw-bold">${partida.fecha_programada}</p>
                <p class="partition-time">${partida.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="partition-client px-3 py-2 ${partida.embarque === "Proyectado" ? "text-primary" : ""}">${partida.cliente}</td>
            <td id="partition-products-${partida.id_partida}" class="px-3 py-2">

            </td>
            <td class="text-center px-3 py-2">
                <p class="partition-status ${statusClass}">${partida.planta}</p>
            </td>
            <td class="partition-destination px-3 py-2">${partida.destino || partida.ubicacion}</td>
            <td class="partition-control text-center d-none" data-vent-only data-fact-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.embarque === "Cargado" || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.planta === "Terminado" ? "Completado" : partida.planta === "Cancelado" ? "Cancelado" :"Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta partida
        const container = document.getElementById(`partition-products-${partida.id_partida}`);
        container.innerHTML = '';

        let tarimas = 0;
        let marcos = 0;
        let cancelados = 0;

        for (const producto of productos) {
            if (partida.planta !== "Cancelado") {
                if (producto.producto?.includes('TARIMA')) {
                    const cantidad = producto.cantidad_solicitada || 0;
                    tarimas += cantidad;
                    totalTarimas += cantidad;
                } 
                else if (producto.producto?.includes('MARCO')) {
                    const cantidad = producto.cantidad_solicitada || 0;
                    marcos += cantidad;
                    totalMarcos += cantidad;
                }

            } else if ((partida.planta === "Cancelado")) {
                const cantidad = producto.cantidad_solicitada || 0;
                cancelados += cantidad;
                totalCancelado += cantidad;
            }

            container.innerHTML += 
            `<p class="partition-product ${partida.embarque === "Proyectado" ? "text-primary" : ""}">${producto.codigo} - <b>Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="partition-cant">${producto.producto}</p>
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
