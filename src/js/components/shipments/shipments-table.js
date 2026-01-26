// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
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

    // Ordenar el arreglo completo antes de generar la tabla
    allPartitions.sort((a, b) => {
        const dateA = new Date(`${a.fecha_programada}T${a.hora_programada}`);
        const dateB = new Date(`${b.fecha_programada}T${b.hora_programada}`);
        return dateA - dateB;
    });
    
    const tbody = document.querySelector('#shipments-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    let totalSol = 0;

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
        if (partida.embarque == 'En preparación') {
            shipmentStatusClass = 'yellow';
        } else if (partida.embarque == 'Proceso de carga') {
            shipmentStatusClass = 'greenL';
        } else if (partida.embarque == 'Cargado') {
            shipmentStatusClass = 'greenD';
        } else if (partida.embarque == 'Cancelado') {
            shipmentStatusClass = 'red';
        } else {
            shipmentStatusClass = 'blue';
        }

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular totales de cantidades
        const requestedTotal = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);

        totalSol += requestedTotal;

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
            <td class="production-destination p-2">${partida.destino || partida.ubicacion}</td>
            <td class="text-center p-2">
                <p class="shipment-status ${productionStatusClass}">${partida.planta}</p>
            </td>
            <td class="text-center p-2">
                <p class="shipment-status ${shipmentStatusClass}">${partida.embarque}</p>
            </td>
            <td class="p-2">
                <p class="shipment-unit">${partida.unidad || "Sin Asignar"}</p>
                <p class="shipment-license">${partida.placas || "-"}</p>
            </td>
            <td class="shipment-observation p-2">${partida.observaciones}</td>
            <td class="shipment-control text-center d-none" data-prod-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.embarque === "Cargado" || partida.planta !== "Terminado" || partida.unidad === undefined || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.embarque === "Cargado" ? "Completado" : partida.embarque === "Cancelado" ? "Cancelado" : "Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos solicitados de esta partida
        const requestedContainer = document.getElementById(`production-products-${partida.id_partida}`);
        requestedContainer.innerHTML = '';

        for (const producto of productos) {
            requestedContainer.innerHTML += 
            `<p class="shipment-product">${producto.codigo} - <b> Cant. ${producto.cantidad_solicitada.toLocaleString('en-US')}</b></p>
            <p class="shipment-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center">Tarimas Totales</td>
        <td class="p-2">${totalSol.toLocaleString('en-US')}</td>
        <td colspan="6"></td>
    </tr>`;

    validateUserRole()
}
