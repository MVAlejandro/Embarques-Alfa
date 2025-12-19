// Servicios Supabase
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

    // Ordenar el arreglo completo antes de generar la tabla
    allPartitions.sort((a, b) => {
        const dateA = new Date(`${a.fecha_programada}T${a.hora_programada}`);
        const dateB = new Date(`${b.fecha_programada}T${b.hora_programada}`);
        return dateA - dateB;
    });
    
    const tbody = document.querySelector('#production-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    let totalGeneral = 0;

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
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_partida || 0), 0);

        totalGeneral += totalAmount;

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
            <td class="production-control text-center d-none" data-vent-only data-prod-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.planta === "Terminado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.planta === "Terminado" ? "Completado" : "Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta partida
        const container = document.getElementById(`production-products-${partida.id_partida}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="production-product">${producto.codigo} - <b> Cant. ${producto.cantidad_partida.toLocaleString('en-US')}</b></p>
            <p class="production-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center">Tarimas Totales</td>
        <td class="p-2">${totalGeneral.toLocaleString('en-US')}</td>
        <td colspan="2"></td>
    </tr>`;

    validateUserRole()
}
