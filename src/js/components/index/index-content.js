// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { renderPlanningTable } from '../../components/planning/planning-table.js'

let allPartitions = [];
let date = new Date().toISOString().split('T')[0];

export async function createResume() {
    // Obtener partidas
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por semana y año seleccionados
    const filtered = allPartitions.filter(o => 
        o.fecha_programada === date);

    renderTotal(filtered)
    renderFinished(filtered)
    renderDelivered(filtered)
    renderPlanningTable(filtered);
}

// Función para crear la card de tickets totales
export async function renderTotal(partitionsParam = null) {
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

    // Generar el contenido
    element.textContent = `${allPartitions.length.toLocaleString('en-US')}`;
}

// Función para crear la card de tickets pendientes
export async function renderFinished(partitionsParam = null) {
    // Obtener allPartitionses de la lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    }
    
    const element = document.getElementById("finished-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allPartitions.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    let filtered = allPartitions.filter(p => p.facturacion === "Documentado");

    // Generar el contenido
    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-warning`;
}

// Función para crear la card de tickets finalizados
export async function renderDelivered(partitionsParam = null) {
    // Obtener allPartitionses de la lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    }
    
    const element = document.getElementById("delivered-text");
    // Limpiar elemento antes de insertar
    element.textContent = "";

    if (!allPartitions.length) {
        element.textContent = `-`;
        element.className = "general-report-cant text-muted";
        return;
    }

    let filtered = allPartitions.filter(p => p.transporte === "Entregado");
    
    // Generar el contenido
    element.textContent = `${filtered.length.toLocaleString('en-US')}`;
    element.className = `general-report-cant text-success`;
}