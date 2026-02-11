// Servicios Supabase
import { getFullTrips } from '../../services/trips-service.js';

let allTrips = [];
let date = new Date().toISOString().split('T')[0];

export async function createResume() {
    // Obtener partidas
    allTrips = await getFullTrips();
    if (!allTrips) return;

    // Filtrar por semana y año seleccionados
    const filtered = allTrips.filter(o => o.fecha_programada === date);
    const weekText = document.getElementById('weekHeader');
    
    // Colocar la semana del viaje
    if (!allTrips || allTrips.length === 0) {
        weekText.innerHTML = "Semana 0";
    } else {
        weekText.innerHTML = `Semana ${allTrips[0].semana}`;
    }

    renderTotal(filtered)
    renderFinished(filtered)
    renderCanceled(filtered)
}

// Función para crear la card de tickets totales
export async function renderTotal(tripsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    }
    
    const element = document.getElementById("partitions-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allTrips.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    // Generar el contenido
    element.textContent = `${allTrips.length.toLocaleString('en-US')}`;
}

// Función para crear la card de tickets pendientes
export async function renderFinished(tripsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    }
    
    const element = document.getElementById("finished-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allTrips.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    let filtered = allTrips.filter(t => t.estado === "Completado");

    // Generar el contenido
    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-success`;
}

// Función para crear la card de tickets finalizados
export async function renderCanceled(tripsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    }
    
    const element = document.getElementById("canceled-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allTrips.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    let filtered = allTrips.filter(t => t.estado === "Cancelado")
    
    // Generar el contenido
    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-danger`;
}