// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js';

let allPartitions = [];

const statusColorMap = {
    // Azul
    "Planeado": "blue", "En secado": "blue",
    // Amarillo
    "Pendiente": "yellow", "En proceso": "yellow", "En preparación": "yellow", "En ruta": "yellow",
    // Verde claro
    "PT parcial": "greenL", "Proceso de carga": "greenL", "Asignado": "greenL", "Documentado": "greenL",
    // Verde oscuro
    "Terminado": "greenD", "Cargado": "greenD", "Entregado": "greenD",
    // Rojo
    "Cancelado": "red",
    // Gris
    "Reprogramado": "grey"
};

function getColor(status) {
    return statusColorMap[status];
}

// Función para buscar la partida por id
export function getPartitionById(id) {
    return allPartitions.find(p => p.id_partida == id);
}

// Función para crear la tabla y la paginación
export async function renderPlanningTable(partitionsParam = null) {
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
    
    const tbody = document.querySelector('#planning-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;
    
    for (const partida of allPartitions) {
        const plantaClass = getColor(partida.planta);
        const transporteClass = getColor(partida.transporte);
        const embarqueClass = getColor(partida.embarque);
        const facturacionClass = getColor(partida.facturacion);

        tbody.innerHTML += 
        `<tr data-partition-id="${partida.id_partida}">
            <td class="planning-client p-2 ps-4">${partida.cliente}</td>
            <td class="planning-date p-2 fw-bold">${partida.fecha_programada}</td>
            <td class="text-center p-2">
                <button class="btn-primary planning-status ${plantaClass}"
                    data-bs-target="#production-modal" 
                    data-bs-toggle="modal">
                        ${partida.planta}
                </button>
            </td>
            <td class="text-center p-2">
                <button class="btn-primary planning-status ${partida.planta === "Cancelado" ? plantaClass : embarqueClass}"
                    data-bs-target="#shipment-modal" 
                    data-bs-toggle="modal">
                        ${partida.planta === "Cancelado" ? "Cancelado" : partida.embarque}
                </button>
            </td>
            <td class="text-center p-2">
                <button class="btn-primary planning-status ${partida.planta === "Cancelado" ? plantaClass : facturacionClass}"
                    data-bs-target="#bill-modal" 
                    data-bs-toggle="modal">
                        ${partida.planta === "Cancelado" ? "Cancelado" : partida.facturacion}
                </button>
            </td>
            <td class="text-center p-2">
                <button class="btn-primary planning-status ${partida.planta === "Cancelado" ? plantaClass : transporteClass}"
                    data-bs-target="#transport-modal" 
                    data-bs-toggle="modal">
                        ${partida.planta === "Cancelado" ? "Cancelado" : partida.transporte}
                </button>
            </td>
            <td class="planning-time text-center p-2">
                ${partida.planta === "Cancelado" ? "Cancelado" : `${partida.hora_programada?.slice(0, 5)} - ${partida.hora_realizada ? partida.hora_realizada.slice(0, 5) : "Pendiente"}`}
            </td>
        </tr>`;
    }
}
