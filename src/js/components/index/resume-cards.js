// Servicios Supabase
import { getFullTrips } from '../../services/trips-service.js';
import { getPartitions } from '../../services/partitions-service.js';
import { getRecolections } from '../../services/recolections-service.js';
import { getPartitionProducts } from '../../services/partition-product-service.js';

let allTrips = [];
let allPartitions = [];
let allRecolections = [];

export async function createResumeCards(dates) {
    // Obtener viajes
    allTrips = await getFullTrips();
    if (!allTrips) return;
    // Obtener partidas
    allPartitions = await getPartitions();
    if (!allPartitions) return;
    // Obtener recolecciones
    allRecolections = await getRecolections();
    if (!allRecolections) return;

    // Filtrar por semana seleccionados
    allTrips = allTrips.filter(t => t.semana === dates.semana && t.anio == dates.anio);
    allPartitions = allPartitions.filter(p => p.semana === dates.semana && p.anio == dates.anio);
    allRecolections = allRecolections.filter(r => r.semana === dates.semana && r.anio == dates.anio);

    const weekText = document.getElementById('weekHeader');
    
    // Colocar la semana del viaje
    if (!allPartitions || allPartitions.length === 0) {
        weekText.innerHTML = "Semana 0";
    } else {
        weekText.innerHTML = `Semana ${allPartitions[0].semana}`;
    }

    renderTripsCard(allTrips)
    renderPartitionsCard(allPartitions)
    renderRecolectionsCard(allRecolections)
    renderDifferenceCard(allPartitions)
}

// Función para crear la card de tickets totales
export async function renderTripsCard(tripsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    }
    
    const element = document.getElementById("trips-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allTrips.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    // Generar el contenido
    let filtered = allTrips.filter(t => t.estado === "En ruta")
    
    // Generar el contenido
    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-warning`;
}

// Función para crear la card de tickets pendientes
export async function renderPartitionsCard(partitionsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    }
    
    const element = document.getElementById("partitions-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allPartitions.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${allPartitions.length.toLocaleString('en-US')}`;
}

// Función para crear la card de tickets finalizados
export async function renderRecolectionsCard(recolectionsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (recolectionsParam) {
        allRecolections = recolectionsParam;
    }
    
    const element = document.getElementById("recolections-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allRecolections.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    element.textContent = `${allRecolections.length.toLocaleString('en-US')}`;
}

export async function renderDifferenceCard(partitionsParam = null) {
    // Obtener allTripses de la lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    }
    
    const element = document.getElementById("difference-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    // Determinar clase CSS para la diferencia
    let totalSolGeneral = 0;
    let totalEmbGeneral = 0;
    let differenceClass = '';

    if (!allPartitions.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    for (const partida of allPartitions) {
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        if (partida.planta !== "Cancelado") {
            const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            const totalProducedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_embarcada || 0), 0);
        
            totalSolGeneral += totalRequiredAmount;
            totalEmbGeneral += totalProducedAmount;
        }
    }

    if (totalEmbGeneral-totalSolGeneral > 0) {
        differenceClass = 'text-success'; // Verde para positivo
    } else if (totalEmbGeneral-totalSolGeneral < 0) {
        differenceClass = 'text-danger';  // Rojo para negativo
    } else {
        differenceClass = 'text-muted';   // Gris para cero
    }
    
    // Generar el contenido
    element.textContent = `${(totalEmbGeneral-totalSolGeneral).toLocaleString('en-US')}`;
    element.className = `general-report-cant ${differenceClass}`
}