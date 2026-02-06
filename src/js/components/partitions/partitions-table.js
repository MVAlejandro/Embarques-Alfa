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

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;
    
    for (const partida of allPartitions) {
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
                <p class="partition-date fw-bold">${partida.fecha_programada}</p>
                <p class="partition-time">${partida.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="partition-client p-2">${partida.cliente}</td>
            <td id="partition-products-${partida.id_partida}" class="p-2">

            </td>
            <td class="text-center p-2">
                <p class="partition-status ${statusClass}">${partida.planta}</p>
            </td>
            <td class="partition-destination p-2">${partida.destino || partida.ubicacion}</td>
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

        for (const producto of productos) {
            // Calcular total de cantidades por tipo de producto
            if ((producto.producto).includes('TARIMA')) {
                const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
                totalTarimas += totalAmount;
            } else if ((producto.producto).includes('MARCO')) {
                const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
                totalMarcos += totalAmount;
            }

            container.innerHTML += 
            `<p class="partition-product">${producto.codigo} - <b> Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="partition-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active">
        <td colspan="2" class="p-2 text-center fw-bold">TOTALES</td>
        <td colspan="2" class="p-2"><b>Tarimas: </b>${totalTarimas.toLocaleString('en-US')} Unidades</td>
        <td colspan="2" class="p-2"><b>Marcos: </b>${totalMarcos.toLocaleString('en-US')} Unidades</td>
    </tr>`;

    validateUserRole()
}
