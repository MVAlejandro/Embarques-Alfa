// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { renderPlanningTable } from '../../components/planning/planning-table.js'
// Utilidades
import { obtainLastWeek } from "../../utils/week-functions";

let allPartitions = [];
let date = new Date().toISOString().split('T')[0];

export async function renderTable() {
    const lastWeek = await obtainLastWeek();

    // Obtener partidas
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por semana y año seleccionados
    const filtered = allPartitions.filter(o => 
        o.semana === lastWeek.semana && 
        o.anio === lastWeek.anio && 
        o.fecha_programada === date);

    renderPlanningTable(filtered);
}