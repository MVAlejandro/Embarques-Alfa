// Servicios Supabase
import { getPartitions } from "../../services/partitions-service"; 
import { getPartitionProducts } from '../../services/partition-product-service.js';

let allPartitions = [];

// Función para crear la card de producción
export async function renderProductsState(start, end) {
    // Obtener todas las partidas
    allPartitions = await getPartitions();

    // Filtrar por fechas seleccionadas
    allPartitions = allPartitions.filter(p => { const fecha = new Date(p.fecha_programada);
        return fecha >= start && fecha <= end;
    });

    const container = document.getElementById("graphic-products-container");

    // Limpiar contenedor
    container.innerHTML = "";

    // Inicializar valores
    let totalSolGeneral = 0;
    let totalProdGeneral = 0;
    let totalEmbGeneral = 0;
    let totalCancelado = 0;
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
            const totalShipedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_embarcada || 0), 0);
            
            totalSolGeneral += totalRequiredAmount;
            totalProdGeneral += totalProducedAmount;
            totalEmbGeneral += totalShipedAmount;
        } else if (partida.planta === "Cancelado") {
            const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            const totalShipedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_embarcada || 0), 0);
            
            totalSolGeneral += totalRequiredAmount;
            totalCancelado += totalRequiredAmount;
            totalEmbGeneral += totalShipedAmount;
        } else {
            const totalRequiredAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            const totalShipedAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_embarcada || 0), 0);
            
            totalSolGeneral += totalRequiredAmount;
            totalEmbGeneral += totalShipedAmount;
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
    const porcentajeEmbarque = (totalEmbGeneral / totalSolGeneral) * 100;
    const porcentajeCancelado = (totalCancelado / totalSolGeneral) * 100;

    container.className = `h-100 d-grid px-5 px-md-4 py-4`;
    container.innerHTML = `
        <div class="d-flex align-items-center px-2">
            <a href="./production.html" class="fw-bold card-text text-decoration-none">PRODUCCIÓN</a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-boxes ms-auto" viewBox="0 0 16 16">
                <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"/>
            </svg>
        </div>
        <div class="card-qty px-2 px-md-0 px-lg-2">
            <a href="./partitions.html" class="general-report-cant text-primary d-flex align-items-center justify-content-between">${totalSolGeneral.toLocaleString('en-US')} <span class="general-report-text">Solicitado</span></a>
            <a href="./partitions.html?canceled=1" class="general-report-cant text-danger d-flex align-items-center justify-content-between">${totalCancelado.toLocaleString('en-US')} <span class="general-report-text">Cancelado (${porcentajeCancelado.toFixed(1)}%)</span></a>
            <hr>
            <a href="./partitions.html" class="general-report-cant text-muted d-flex align-items-center justify-content-between">${(totalSolGeneral-totalCancelado).toLocaleString('en-US')} <span class="general-report-text">Total</span></a>
            <a href="./production.html" class="general-report-cant text-warning d-flex align-items-center justify-content-between">${totalProdGeneral.toLocaleString('en-US')} <span class="general-report-text">Producido (${porcentajePlanta.toFixed(1)}%)</span></a>
            <a href="./shipments.html" class="general-report-cant text-success d-flex align-items-center justify-content-between">${totalEmbGeneral.toLocaleString('en-US')} <span class="general-report-text">Embarcado (${porcentajeEmbarque.toFixed(1)}%)</span></a>
        </div>`;
}
