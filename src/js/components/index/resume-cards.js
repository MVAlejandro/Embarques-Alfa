// Servicios Supabase
import { getFullTrips } from '../../services/trips-service.js';
import { getPartitions } from '../../services/partitions-service.js';
import { getRecolections } from '../../services/recolections-service.js';
import { getPartitionProducts } from '../../services/partition-product-service.js';

let allPartitions = [];
let allRecolections = [];

export async function createResumeCards(dates) {
    // Obtener partidas
    allPartitions = await getPartitions();
    if (!allPartitions) return;
    // Obtener recolecciones
    allRecolections = await getRecolections();
    if (!allRecolections) return;

    // Filtrar por semana seleccionados
    allPartitions = allPartitions.filter(p => p.semana === dates.semana && p.anio == dates.anio);
    allRecolections = allRecolections.filter(r => r.semana === dates.semana && r.anio == dates.anio);

    const weekText = document.getElementById('weekHeader');
    
    // Colocar la semana de la partida
    if (!allPartitions || allPartitions.length === 0) {
        weekText.innerHTML = "0";
    } else {
        weekText.innerHTML = `${allPartitions[0].semana}`;
    }

    renderPartitionsCard(allPartitions)
    renderRecolectionsCard(allRecolections)
    renderProductsCards(allPartitions)
}

// Función para crear la card de partidas
export async function renderPartitionsCard(partitionsParam = null) {
    // Obtener allPartitionses de la lista filtrada
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

// Función para crear la card de recolecciones
export async function renderRecolectionsCard(recolectionsParam = null) {
    // Obtener allPartitionses de la lista filtrada
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

// Función para crear la card de productos totales
export async function renderProductsCards(partitionsParam = null) {
    // Obtener allPartitionses de la lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    }
    
    const element1 = document.getElementById("pallets-text");
    const element2 = document.getElementById("frames-text");
    // Limpiar elemento antes de insertar
    element1.textContent = "";
    element2.textContent = "";

    // Inicializar valores
    let totalTarimas = 0;
    let totalMarcos = 0;

    if (!allPartitions.length) {
        element1.textContent = `-`;
        element1.className = "general-report-cant text-muted";

        element2.textContent = `-`;
        element2.className = "general-report-cant text-muted";
        return;
    }

    for (const partida of allPartitions) {
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        let tarimas = 0;
        let marcos = 0;
        let cancelados = 0;

        for (const producto of productos) {
            if (partida.planta !== "Cancelado") {
                if (producto.producto?.includes('TARIMA')) {
                    const cantidad = producto.cantidad_solicitada || 0;
                    tarimas += cantidad;
                    totalTarimas += cantidad;
                } 
                else if (producto.producto?.includes('MARCO')) {
                    const cantidad = producto.cantidad_solicitada || 0;
                    marcos += cantidad;
                    totalMarcos += cantidad;
                }

            } else if ((partida.planta === "Cancelado")) {
                const cantidad = producto.cantidad_solicitada || 0;
                cancelados += cantidad;
                totalCancelado += cantidad;
            }
        }
    }
    
    // Generar el contenido
    element1.textContent = `${totalTarimas.toLocaleString('en-US')}`;
    element1.className = `general-report-cant text-primary`

    element2.textContent = `${totalMarcos.toLocaleString('en-US')}`;
    element2.className = "general-report-cant text-primary";
}