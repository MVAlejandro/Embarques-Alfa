// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { renderPlanningTable } from '../../components/planning/planning-table.js'

let allPartitions = [];
let date = new Date().toISOString().split('T')[0];

export async function renderTable() {
    // Obtener partidas
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por semana y año seleccionados
    const filtered = allPartitions.filter(o => 
        o.fecha_programada === date);

    renderPlanningTable(filtered);
}