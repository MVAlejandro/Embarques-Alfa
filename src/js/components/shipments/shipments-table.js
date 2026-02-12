// Servicios Supabase
import { getPartitions, getPartitionTrip } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js';
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];

// Función para crear la tabla y la paginación
export async function renderShipmentsTable(partitionsParam = null) {
    // Obtener partidas si no se pasa una lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    } else {
        allPartitions = await getPartitions();
    }
    
    const tbody = document.querySelector('#shipments-table tbody');
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
        // Determinar clase CSS para el estatus de producción
        let productionStatusClass = '';
        if (partida.planta == 'En proceso') {
            productionStatusClass = 'yellow';
        } else if (partida.planta == 'PT parcial') {
            productionStatusClass = 'greenL';
        } else if (partida.planta == 'En secado') {
            productionStatusClass = 'blue';
        } else if (partida.planta == 'Terminado') {
            productionStatusClass = 'greenD';
        } else if (partida.planta == 'Cancelado') {
            productionStatusClass = 'red';
        } else {
            productionStatusClass = 'grey';
        }

        // Determinar clase CSS para el estatus de embarque
        let shipmentStatusClass = '';
        if (partida.embarque == 'Preparando') {
            shipmentStatusClass = 'yellow';
        } else if (partida.embarque == 'En carga') {
            shipmentStatusClass = 'greenL';
        } else if (partida.embarque == 'Cargado') {
            shipmentStatusClass = 'greenD';
        } else if (partida.embarque == 'Cancelado') {
            shipmentStatusClass = 'red';
        } else {
            shipmentStatusClass = 'blue';
        }

        // Obtener viaje relacionado a la partida si hay
        let viaje = {};
        if (partida.id_viaje) {
            viaje = await getPartitionTrip(partida.id_viaje);
        }
        
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="shipment-date fw-bold">${partida.fecha_programada}</p>
                <p class="shipment-time">${partida.hora_programada.slice(0, 5)}</p>
                <p class="shipment-time-final">${partida.hora_realizada?.slice(0, 5) || "Pendiente"}</p>
            </td>
            <td class="shipment-client p-2">${partida.cliente}</td>
            <td id="production-products-${partida.id_partida}" class="p-2">

            </td>
            <td class="shipment-destination p-2">${partida.destino || partida.ubicacion}</td>
            <td class="text-center p-2">
                <p class="shipment-status ${productionStatusClass}">${partida.planta}</p>
            </td>
            <td class="text-center p-2">
                <p class="shipment-status ${shipmentStatusClass}">${partida.embarque}</p>
            </td>
            <td class="p-2">
                <p class="shipment-unit">${viaje.unidad || "Sin Asignar"}</p>
                <p class="shipment-license">${viaje.placas || "-"}</p>
            </td>
            <td class="shipment-observation p-2">${partida.observaciones}</td>
            <td class="shipment-control text-center d-none" data-prod-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.embarque === "Cargado" || partida.planta !== "Terminado" || viaje.unidad === undefined || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.embarque === "Cargado" ? "Completado" : partida.embarque === "Cancelado" ? "Cancelado" : "Actualizar"}
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
                    const cantidad = producto.cantidad_producida || 0;
                    tarimas += cantidad;
                    totalTarimas += cantidad;
                } 
                else if (producto.producto?.includes('MARCO')) {
                    const cantidad = producto.cantidad_producida || 0;
                    marcos += cantidad;
                    totalMarcos += cantidad;
                }

            } else if ((partida.planta === "Cancelado")) {
                const cantidad = producto.cantidad_solicitada || 0;
                cancelados += cantidad;
                totalCancelado += cantidad;
            }

            requestedContainer.innerHTML += 
            `<p class="shipment-product">${producto.codigo} - <b>Cant. ${(producto.cantidad_producida ?? 0).toLocaleString('en-US')}</b></p>
            <p class="shipment-cant">${producto.producto}</p>
            <hr>`;
        }
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active">
        <td></td>
        <td colspan="7">
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
