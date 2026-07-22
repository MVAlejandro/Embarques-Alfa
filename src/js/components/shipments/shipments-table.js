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

    let totalSolGeneral = 0;
    let totalEmbGeneral = 0;
    let totalCancelado = 0;

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;

    for (const partida of allPartitions) {
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
        } else if (partida.embarque == 'Proyectado') {
            shipmentStatusClass = 'blue';
        } else {
            shipmentStatusClass = 'yellow';
        }

        // Obtener viaje relacionado a la partida si hay
        let viaje = {};
        if (partida.id_viaje) {
            viaje = await getPartitionTrip(partida.id_viaje);
        }
        
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        if (partida.planta !== "Cancelado") {
            const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            const totalProducedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_embarcada || 0), 0);

            totalSolGeneral += totalRequiredAmount;
            totalEmbGeneral += totalProducedAmount;
        } else if (partida.planta === "Cancelado") {
            const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            totalCancelado += totalAmount;
        }

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-3">
                <p class="shipment-date fw-bold">${partida.fecha_programada}</p>
                <p class="shipment-time">${partida.hora_programada.slice(0, 5)}</p>
                <p class="shipment-time-final">${partida.hora_embarcada?.slice(0, 5) || "Pendiente"}</p>
            </td>
            <td class="shipment-client px-3 py-2 ${partida.embarque === "Proyectado" ? "text-primary" : ""}">${partida.cliente}</td>
            <td id="partition-products-${partida.id_partida}">

            </td>
            <td id="shipment-products-${partida.id_partida}">

            </td>
            <td class="text-center px-3 py-2">
                <p class="shipment-status ${shipmentStatusClass}">${partida.embarque}</p>
            </td>
            <td class="px-3 py-2">
                <p class="shipment-unit">${viaje.unidad || "Sin Asignar"}</p>
                <p class="shipment-license">${viaje.placas || "-"}</p>
            </td>
            <td class="shipment-observation px-3 py-2">${partida.observaciones}</td>
            <td class="shipment-control text-center d-none" data-prod-only data-coor-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.embarque === "Cargado" || partida.planta !== "Terminado" || viaje.unidad === undefined || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.embarque === "Cargado" ? "Completado" : partida.embarque === "Cancelado" ? "Cancelado" : "Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta partida
        const container1 = document.getElementById(`partition-products-${partida.id_partida}`);
        const container2 = document.getElementById(`shipment-products-${partida.id_partida}`);
        container1.innerHTML = '';
        container2.innerHTML = '';

        for (const producto of productos) {
            container1.innerHTML += 
            `<p class="partition-product ${partida.embarque === "Proyectado" ? "text-primary" : ""}">${producto.codigo} -  <b> Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="partition-cant">${producto.producto}</p>
            <hr>`;
            container2.innerHTML += 
            `<p class="production-product">${producto.codigo} - <b> Cant. ${(producto.cantidad_embarcada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="production-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active">
        <td></td>
        <td class="fw-bold">TOTALES</td>
        <td colspan="5">
            <table class="text-center container-fluid">
                <tbody>
                    <tr>
                        <td><b>Solicitado: </b>${totalSolGeneral.toLocaleString('en-US')} pz</td>
                        <td><b>Embarcado: </b>${totalEmbGeneral.toLocaleString('en-US')} pz</td>
                        <td><b>Diferencia: </b>${(totalEmbGeneral-totalSolGeneral).toLocaleString('en-US')} pz</td>
                        <td><b>Cancelado: </b>${totalCancelado.toLocaleString('en-US')} pz</td>
                    </tr>    
                </tbody>
            </table>
        </td>
        <td></td>
    </tr>`;

    validateUserRole()
}
