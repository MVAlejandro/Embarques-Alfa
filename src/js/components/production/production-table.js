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

    let totalSolGeneral = 0;
    let totalProdGeneral = 0;

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
        // Calcular total de cantidades
        const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
        const totalProducedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_producida || 0), 0);

        totalSolGeneral += totalRequiredAmount;
        totalProdGeneral += totalProducedAmount;

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="production-date fw-bold">${partida.fecha_programada}</p>
                <p class="production-time">${partida.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="production-client p-2">${partida.cliente}</td>
            <td id="partition-products-${partida.id_partida}" class="p-2">

            </td>
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

        // Insertar productos de esta partida
        const container1 = document.getElementById(`partition-products-${partida.id_partida}`);
        const container2 = document.getElementById(`production-products-${partida.id_partida}`);
        container1.innerHTML = '';
        container2.innerHTML = '';

        for (const producto of productos) {
            container1.innerHTML += 
            `<p class="partition-product">${producto.codigo} -  <b> Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="partition-cant">${producto.producto}</p>
            <hr>`;
            container2.innerHTML += 
            `<p class="production-product">${producto.codigo} - <b> Cant. ${(producto.cantidad_producida ?? 0).toLocaleString('en-US')}</b></p>
            <p class="production-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active">
        <td colspan="2" class="p-2 text-center fw-bold">TOTALES</td>
        <td class="p-2"><b>Solicitado: </b>${totalSolGeneral.toLocaleString('en-US')} Unidades</td>
        <td class="p-2"><b>Producido: </b>${totalProdGeneral.toLocaleString('en-US')} Unidades</td>
        <td colspan="3" class="p-2"><b>Diferencia: </b>${(totalProdGeneral-totalSolGeneral).toLocaleString('en-US')} Unidades</td>
    </tr>`;

    validateUserRole()
}
