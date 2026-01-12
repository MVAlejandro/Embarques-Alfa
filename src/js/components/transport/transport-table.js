// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];

// Función para crear la tabla y la paginación
export async function renderTransportTable(partitionsParam = null) {
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
    
    const tbody = document.querySelector('#transport-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    // Calcular total de cantidades
    let totalGeneral = 0;
    const totalDistance = allPartitions.reduce((acc, part) => acc + (part.distancia || 0), 0);
    const totalFuel = allPartitions.reduce((acc, part) => acc + (part.combustible || 0), 0);
    const totalPrice = allPartitions.reduce((acc, part) => acc + (part.costo || 0), 0);
    const totalTag = allPartitions.reduce((acc, part) => acc + (part.tag || 0), 0);

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;

    for (const partida of allPartitions) {
        // Determinar clase CSS para el estatus
        let transporStatusClass = '';
        let partDistance;
        let fuel;
        let fuelPrice;
        let tag;

        if (partida.transporte == 'Asignado') {
            transporStatusClass = 'greenL';
        } else if (partida.transporte == 'Planeado') {
            transporStatusClass = 'blue';
        } else if (partida.transporte == 'En ruta') {
            transporStatusClass = 'yellow';
        } else if (partida.transporte == 'Entregado') {
            transporStatusClass = 'greenD';
        } else {
            transporStatusClass = 'red';
        } 

        // Determinar distancia, costo, combustible y tag
        if (partida.distancia) {
            partDistance = partida.distancia;
        } else {
            partDistance = 0;
        }

        if (partida.combustible) {
            fuel = partida.combustible;
        } else {
            fuel = 0;
        }

        if (partida.costo) {
            fuelPrice = partida.costo;
        } else {
            fuelPrice = 0;
        }
        if (partida.tag) {
            tag = partida.costo;
        } else {
            tag = 0;
        }

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);

        totalGeneral += totalAmount;

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="transport-date fw-bold">${partida.fecha_programada}</p>
                <p class="transport-time">${partida.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="transport-client p-2">${partida.cliente}</td>
            <td class="transport-cant fw-bold p-2">Cant. ${totalAmount}</td>
            <td class="production-destination p-2">${partida.destino || partida.ubicacion}</td>
            <td class="transport-distance p-2 d-none d-print-table-cell">${partDistance.toLocaleString('en-US')} Km</td>
            <td class="transport-fuel p-2 d-none d-print-table-cell">${fuel.toLocaleString('en-US')} Lts</td>
            <td class="transport-price p-2 d-none d-print-table-cell">$${fuelPrice.toLocaleString('en-US')}</td>
            <td class="transport-tag p-2 d-none d-print-table-cell">$${tag.toLocaleString('en-US')}</td>
            <td class="text-center p-2 d-print-none">
                <p class="transport-status ${transporStatusClass}">${partida.transporte}</p>
            </td>
            <td class="p-2">
                <p class="transport-unit">${partida.unidad || "Sin Asignar"}</p>
                <p class="transport-license">${partida.placas || "-"}</p>
            </td>
            <td class="transport-operator p-2">${partida.operador || "Sin Asignar"}</td>
            <td class="transport-control text-center d-print-none d-none" data-trans-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.transporte === "Entregado" || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.transporte === "Entregado" ? "Completado" : partida.transporte === "Cancelado" ? "Cancelado" : "Actualizar"}
                </button>
            </td>
        </tr>`;
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center d-print-none">Tarimas Totales</td>
        <td colspan="2" class="text-center d-none d-print-table-cell">Totales</td>
        <td class="p-2">${totalGeneral.toLocaleString('en-US')}</td>
        <td class="d-none d-print-table-cell"></td>
        <td class="p-2 d-none d-print-table-cell">${totalDistance.toLocaleString('en-US')} Km</td>
        <td class="p-2 d-none d-print-table-cell">${totalFuel.toLocaleString('en-US')} Lts</td>
        <td class="p-2 d-none d-print-table-cell">$${totalPrice.toLocaleString('en-US')}</td>
        <td class="p-2 d-none d-print-table-cell">$${totalTag.toLocaleString('en-US')}</td>
        <td colspan="5"></td>
    </tr>`;

    validateUserRole()
}
