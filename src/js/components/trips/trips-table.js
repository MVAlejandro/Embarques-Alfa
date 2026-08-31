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
    console.log(allTrips);
    
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
        `<tr data-id-viaje="${viaje.id_viaje}">
            <td class="p-2 ps-4">
                <p class="trip-date fw-bold">${viaje.fecha_programada}</p>
                <p class="trip-time">${viaje.hora_programada.slice(0, 5)}</p>
                <p class="trip-departure-time">${viaje.hora_salida?.slice(0, 5) || "Pendiente"}</p>
            </td>
            <td class="trip-type p-2 fst-italic">${viaje.tipo}</td>
            <td class="trip-events p-2">
                <p class="trip-partitions ${viaje.tipo === "Recolección" ? "d-none" : ""}">Partidas: ${viaje.partidas.length || "-"}</p>
                <p class="trip-recolections ${viaje.tipo === "Partida" ? "d-none" : ""}">Recolecciones: ${viaje.recolecciones.length || "-"}</p>
            </td>
            <td class="p-2">
                <p class="trip-unit">${viaje.unidad || "Sin Asignar"}</p>
                <p class="trip-operator">${viaje.operador || "Sin Asignar"}</p>
            </td>
            <td class="text-center p-2 d-print-none">
                <p class="trip-status ${tripStatusClass}">${viaje.estado}</p>
            </td>
            <td class="planning-events p-2">
                <ul class="planning-partitions ps-4 ${viaje.tipo === "Recolección" ? "d-none" : ""}">
                    
                </ul>
                <ul class="planning-recolections ps-4 ${viaje.tipo === "Partida" ? "d-none" : ""}">
                    
                </ul>
            </td>
            <td class="trip-control text-center d-print-none d-none" data-trans-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#trip-modal" 
                    data-bs-toggle="modal"
                    ${viaje.estado === "Cancelado" ? "disabled" : ""}
                    trip-data='${JSON.stringify(viaje)}'>
                    ${viaje.estado === "Completado" ? "Completado" : viaje.estado === "Cancelado" ? "Cancelado" : "Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar los eventos del viaje en la tabla
        addEventTableRow(viaje.id_viaje, viaje.tipo, viaje.partidas, viaje.recolecciones);
    };

    validateUserRole()
}

// Función para agregar campos de productos con input y validación de cantidad
function addEventTableRow(id, tipo, partitions, recolections) {
    // Cargar los eventos asignados para rellenar listado
    const row = document.querySelector(`[data-id-viaje="${id}"]`);
    if (!row) return;

    const containerP = row.querySelector('.planning-partitions');
    const containerR = row.querySelector('.planning-recolections');

    if (!containerP || !containerR) return;

    // Limpiar elementos antes de insertar
    containerP.innerHTML = '';
    containerR.innerHTML = '';
    
    // PARTIDAS
    if (tipo === 'Recolección') {
        containerP.classList.add('d-none');
    } else {
        containerP.classList.remove('d-none');

        if (!partitions?.length) {
            containerP.innerHTML = `<p class="partition-element fw-bold">No hay partidas asociadas</p>`;
        } else {
            for (const partition of partitions) {
                const li = document.createElement('li');
                li.dataset.idPartition = partition.id_partida;

                li.innerHTML = `
                    <p class="partition-element">
                        ${partition.hora_programada?.slice(0, 5) || ''} - <span class="fw-bold">${partition.cliente}</span> (Partida)
                    </p>
                `;

                containerP.appendChild(li);
            }
        }
    }

    // RECOLECCIONES
    if (tipo === 'Partida') {
        containerR.classList.add('d-none');
    } else {
        containerR.classList.remove('d-none');

        if (!recolections?.length) {
            containerR.innerHTML = `<p class="recolection-element fw-bold">No hay recolecciones asociadas</p>`;
        } else {
            for (const recolection of recolections) {
                const li = document.createElement('li');
                li.dataset.idRecolection = recolection.id_recoleccion;

                li.innerHTML = `
                    <p class="recolection-element">
                        ${recolection.hora_programada?.slice(0, 5) || ''} - <span class="fw-bold">${recolection.proveedor}</span> (Recolección)
                    </p>
                `;

                containerR.appendChild(li);
            }
        }
    }
}