// Servicios Supabase
import { getTrips } from '../../services/trips-service.js';
import { getPartitionProducts } from '../../services/partition-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allTrips = [];

// Función para crear la tabla y la paginación
export async function renderTransportTable(tripsParam = null) {
    // Obtener viajes si no se pasa una lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    } else {
        allTrips = await getTrips();
    }

    // Ordenar el arreglo completo antes de generar la tabla
    allTrips.sort((a, b) => {
        const dateA = new Date(`${a.fecha_programada}T${a.hora_programada}`);
        const dateB = new Date(`${b.fecha_programada}T${b.hora_programada}`);
        return dateA - dateB;
    });
    
    const tbody = document.querySelector('#transport-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allTrips || allTrips.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay viajes registradas</td></tr>`;
        return;
    }

    // Calcular total de cantidades
    const totalDistance = allTrips.reduce((acc, viaje) => acc + (viaje.distancia || 0), 0);
    const totalFuel = allTrips.reduce((acc, viaje) => acc + (viaje.combustible || 0), 0);
    const totalPrice = allTrips.reduce((acc, viaje) => acc + (viaje.costo || 0), 0);
    const totalTag = allTrips.reduce((acc, viaje) => acc + (viaje.tag || 0), 0);

    weekText.innerHTML = `Semana ${allTrips[0].semana}`;

    for (const viaje of allTrips) {
        let tripType = '';
        let tripStatusClass = '';
        let distance;
        let fuel;
        let fuelPrice;
        let tag;

        if (viaje.tipo == '1') {
            tripType = 'Partida';
        } else if (viaje.tipo == '2') {
            tripType = 'Recolección';
        } else if (viaje.tipo == '3') {
            tripType = 'Partida / Recolección';
        }

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

        // Determinar distancia, costo, combustible y tag
        if (viaje.distancia) {
            distance = viaje.distancia;
        } else {
            distance = 0;
        }

        if (viaje.combustible) {
            fuel = viaje.combustible;
        } else {
            fuel = 0;
        }

        if (viaje.costo) {
            fuelPrice = viaje.costo;
        } else {
            fuelPrice = 0;
        }
        if (viaje.tag) {
            tag = viaje.costo;
        } else {
            tag = 0;
        }

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="transport-date fw-bold">${viaje.fecha_programada}</p>
                <p class="transport-time">${viaje.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="transport-type p-2 fst-italic">${tripType}</td>
            <td class="transport-distance p-2">${distance.toLocaleString('en-US')} Km</td>
            <td class="transport-fuel p-2">${fuel.toLocaleString('en-US')} Lts</td>
            <td class="transport-price p-2">$${fuelPrice.toLocaleString('en-US')}</td>
            <td class="transport-tag p-2">$${tag.toLocaleString('en-US')}</td>
            <td class="text-center p-2 d-print-none">
                <p class="transport-status ${tripStatusClass}">${viaje.estado}</p>
            </td>
            <td class="p-2">
                <p class="transport-unit">${viaje.unidad || "Sin Asignar"}</p>
                <p class="transport-license">${viaje.placas || "-"}</p>
            </td>
            <td class="transport-operator p-2">${viaje.operador || "Sin Asignar"}</td>
            <td class="transport-control text-center d-print-none d-none" data-trans-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
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
        <td class="text-center">Totales</td>
        <td class="d-none d-print-table-cell"></td>
        <td class="p-2">${totalDistance.toLocaleString('en-US')} Km</td>
        <td class="p-2">${totalFuel.toLocaleString('en-US')} Lts</td>
        <td class="p-2">$${totalPrice.toLocaleString('en-US')}</td>
        <td class="p-2">$${totalTag.toLocaleString('en-US')}</td>
        <td colspan="5"></td>
    </tr>`;

    validateUserRole()
}
