// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js';

let allPartitions = [];

const statusColorMap = {
    // Azul
    "Planeado": "blue", "En secado": "blue",
    // Amarillo
    "Pendiente": "yellow", "En proceso": "yellow", "En preparación": "yellow", "En ruta": "yellow",
    // Verde claro
    "PT parcial": "greenL", "Proceso de carga": "greenL", "Asignado": "greenL",
    // Verde oscuro
    "Documentado": "greenD", "Terminado": "greenD", "Cargado": "greenD", "Entregado": "greenD",
    // Rojo
    "Cancelado": "red",
    // Gris
    "Reprogramado": "grey"
};

function getColor(status) {
    return statusColorMap[status];
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
        `<tr>
            <td class="p-2 ps-4">
                <p class="planning-date fw-bold">${partida.fecha_programada}</p>
                <p class="planning-time">${partida.hora_programada}</p>
                <p class="shipment-time-final">${partida.hora_realizada || "-"}</p>
            </td>

            <td class="planning-client p-2">${partida.cliente}</td>

            <td class="text-center p-2">
                <p class="planning-status ${plantaClass}">${partida.planta}</p>
            </td>

            <td class="text-center p-2">
                <p class="planning-status ${transporteClass}">${partida.transporte}</p>
            </td>

            <td class="text-center p-2">
                <p class="planning-status ${embarqueClass}">${partida.embarque}</p>
            </td>

            <td class="text-center p-2">
                <p class="planning-status ${facturacionClass}">${partida.facturacion}</p>
            </td>
        </tr>`;
    }
}
