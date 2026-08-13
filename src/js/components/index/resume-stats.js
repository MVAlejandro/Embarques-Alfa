// Servicios Supabase
import { getPartitions } from "../../services/partitions-service"; 
import { getPartitionProducts } from '../../services/partition-product-service.js';

let allPartitions = [];

// Función para crear la card de producción
export async function renderProductionState(dates) {
    // Obtener todas las partidas
    let allPartitions = await getPartitions();

    // Filtrar por semana y año
    allPartitions = allPartitions.filter( p => p.semana == dates.semana && p.anio == dates.anio );

    const container = document.getElementById("graphic-production-container");

    // Limpiar contenedor
    container.innerHTML = "";

    // Inicializar valores
    let totalSolGeneral = 0;
    let totalProdGeneral = 0;
    let differenceClass = '';

    if (!allPartitions.length) {
        container.innerHTML = `
            <div class="alert alert-info">
                No hay partidas esta semana
            </div>`;
        return;
    }

    for (const partida of allPartitions) {
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        if (partida.planta === "Terminado") {
            const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            const totalProducedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            
            totalSolGeneral += totalRequiredAmount;
            totalProdGeneral += totalProducedAmount;
        } else if (partida.planta !== "Terminado") {
            const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            
            totalSolGeneral += totalRequiredAmount;
        }
    }

    if (totalProdGeneral-totalSolGeneral > 0) {
        differenceClass = 'text-success'; // Verde para positivo
    } else if (totalProdGeneral-totalSolGeneral < 0) {
        differenceClass = 'text-danger';  // Rojo para negativo
    } else {
        differenceClass = 'text-muted';   // Gris para cero
    }

    // Calcular porcentaje
    const porcentajePlanta = (totalProdGeneral / totalSolGeneral) * 100;

    container.className = `h-100 d-grid p-4`;
    container.innerHTML = `
        <div class="d-flex align-items-center px-1 px-md-3">
            <a href="./production.html" class="fw-bold card-text text-decoration-none">PRODUCCIÓN</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-clipboard-check ms-auto" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
            </svg>
        </div>
        <div class="card-qty ms-3">
            <p class="general-report-cant text-muted">${totalSolGeneral.toLocaleString('en-US')} <span class="general-report-text">(Solicitado)</span></p>
            <p class="general-report-cant text-success">${totalProdGeneral.toLocaleString('en-US')} <span class="general-report-text">(Terminado)</span></p>
            <hr>
            <p class="general-report-cant ${differenceClass}">${(totalProdGeneral-totalSolGeneral).toLocaleString('en-US')} <span class="general-report-text">(${porcentajePlanta.toFixed(1)}%)</span></p>
        </div>`;
}

// Función para crear la card de embarques
export async function renderShipmentsState(dates) {
    // Obtener todas las partidas
    let allPartitions = await getPartitions();

    // Filtrar por semana y año
    allPartitions = allPartitions.filter( p => p.semana == dates.semana && p.anio == dates.anio );

    const container = document.getElementById("graphic-shipments-container");

    // Limpiar contenedor
    container.innerHTML = "";

    // Inicializar valores
    let totalSolGeneral = 0;
    let totalEmbGeneral = 0;
    let differenceClass = '';

    if (!allPartitions.length) {
        container.innerHTML = `
            <div class="alert alert-info">
                No hay partidas esta semana
            </div>`;
        return;
    }

    for (const partida of allPartitions) {
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        if (partida.embarque !== "Cancelado") {
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

    // Calcular porcentaje
    const porcentajeEmbarque = (totalEmbGeneral / totalSolGeneral) * 100;

    container.className = `h-100 d-grid p-4`;
    container.innerHTML = `
        <div class="d-flex align-items-center px-1 px-md-3">
            <a href="./shipments.html" class="fw-bold card-text text-decoration-none">EMBARQUES</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-truck ms-auto" viewBox="0 0 16 16">
                <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
            </svg>
        </div>
        <div class="card-qty ms-3">
            <p class="general-report-cant text-muted">${totalSolGeneral.toLocaleString('en-US')} <span class="general-report-text">(Solicitado)</span></p>
            <p class="general-report-cant text-success">${totalEmbGeneral.toLocaleString('en-US')} <span class="general-report-text">(Embarcado)</span></p>
            <hr>
            <p class="general-report-cant ${differenceClass}">${(totalEmbGeneral-totalSolGeneral).toLocaleString('en-US')} <span class="general-report-text">(${porcentajeEmbarque.toFixed(1)}%)</span></p>
        </div>`;
}