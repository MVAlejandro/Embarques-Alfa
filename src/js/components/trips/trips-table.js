// Servicios Supabase
import { getTrips } from '../../services/trips-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allTrips = [];

// Función para crear la tabla y la paginación
export async function renderTripsTable(tripsParam = null) {
    // Obtener viajes si no se pasa una lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    } else {
        allTrips = await getTrips();
    }
    
    const tbody = document.querySelector('#trips-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    tbody.innerHTML = '';

    if (!allTrips || allTrips.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="10">No hay viajes registrados</td></tr>`;
        return;
    }

    if (weekText.textContent === "Semana 0") {
        weekText.innerHTML = `Semana ${allTrips[0].semana}`;
    }

    // Calcular total de cantidades
    const totalDistance = allTrips.reduce((acc, viaje) => acc + (viaje.distancia || 0), 0);
    const totalFuel = allTrips.reduce((acc, viaje) => acc + (viaje.combustible || 0), 0);
    const totalPrice = allTrips.reduce((acc, viaje) => acc + (viaje.costo || 0), 0);
    const totalTag = allTrips.reduce((acc, viaje) => acc + (viaje.tag || 0), 0);

    for (const viaje of allTrips) {
        let tripStatusClass = '';

        if (viaje.estado == 'Planeado') {
            tripStatusClass = 'grey';
        } else if (viaje.estado == 'Asignado') {
            tripStatusClass = 'greenL';
        } else if (viaje.estado == 'En ruta') {
            tripStatusClass = 'yellow';
        } else if (viaje.estado == 'Completado') {
            tripStatusClass = 'greenD';
        } else {
            tripStatusClass = 'red';
        }

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="trip-date fw-bold">${viaje.fecha_programada}</p>
                <p class="trip-time">${viaje.hora_programada.slice(0, 5)}</p>
                <p class="trip-departure-time">${viaje.hora_salida?.slice(0, 5) || "Pendiente"}</p>
            </td>
            <td class="trip-type p-2 fst-italic">${viaje.tipo}</td>
            <td class="trip-distance p-2">${(viaje.distancia ?? 0).toLocaleString('en-US')} Km</td>
            <td class="trip-fuel p-2">${(viaje.combustible ?? 0).toLocaleString('en-US')} Lts</td>
            <td class="trip-price p-2">$${(viaje.costo ?? 0).toLocaleString('en-US')}</td>
            <td class="trip-tag p-2">$${(viaje.tag ?? 0).toLocaleString('en-US')}</td>
            <td class="text-center p-2 d-print-none">
                <p class="trip-status ${tripStatusClass}">${viaje.estado}</p>
            </td>
            <td class="p-2">
                <p class="trip-unit">${viaje.unidad || "Sin Asignar"}</p>
                <p class="trip-license">${viaje.placas || "-"}</p>
            </td>
            <td class="trip-operator p-2">${viaje.operador || "Sin Asignar"}</td>
            <td class="trip-events p-2">
                <p class="trip-partitions ${viaje.tipo === "Recolección" ? "d-none" : ""}">Partidas: ${viaje.partidas.length || "-"}</p>
                <p class="trip-recolections ${viaje.tipo === "Partida" ? "d-none" : ""}">Recolecciones: ${viaje.recolecciones.length || "-"}</p>
            </td>
            <td class="trip-control text-center d-print-none d-none" data-trans-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#trip-modal" 
                    data-bs-toggle="modal"
                    ${viaje.estado === "Completado" || viaje.estado === "Cancelado" ? "disabled" : ""}
                    trip-data='${JSON.stringify(viaje)}'>
                    ${viaje.estado === "Completado" ? "Completado" : viaje.estado === "Cancelado" ? "Cancelado" : "Actualizar"}
                </button>
            </td>
        </tr>`;
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center">Totales</td>
        <td class="p-2">${totalDistance.toLocaleString('en-US')} Km</td>
        <td class="p-2">${totalFuel.toLocaleString('en-US')} Lts</td>
        <td class="p-2">$${totalPrice.toLocaleString('en-US')}</td>
        <td class="p-2">$${totalTag.toLocaleString('en-US')}</td>
        <td colspan="5"></td>
    </tr>`;

    validateUserRole()
}
