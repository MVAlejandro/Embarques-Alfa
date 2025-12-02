// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js';
import { renderPlanningTable } from './planning-table.js';
// Utilidades
import { loadOptions, loadOptionsFilter, loadDaysFilter } from '../../utils/load-select.js';
import { obtainLastWeek, buildWeeksByYear, weekNavigation } from '../../utils/week-functions.js';

let weeksByYear = {};
let allPartitions = [];

// Función para cargar las opciones de filtrado
document.addEventListener('DOMContentLoaded', async () => {
    const lastWeek = await obtainLastWeek();
    // Manejar tabla vacía
    if (!lastWeek || !lastWeek.anio || !lastWeek.semana) {
        lastWeek = { anio: 0, semana: 0 };
    }

    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    // Cargar filtros con valores iniciales
    loadOptionsFilter('year-filter', getPartitions, 'anio', 'anio', "Seleccione...", lastWeek.anio);
    loadOptionsFilter('week-filter', getPartitions, 'semana', 'semana', "Seleccione...", lastWeek.semana);
    loadOptions('client-filter', 'emb_clientes', 'id_cliente', 'nombre', 'Todos');

    // Construir semanas por año
    weeksByYear = await buildWeeksByYear();

    // Render inicial
    await planningFilter();
    loadDaysFilter();

    // Navegación entre semanas
    if (btnPrev) btnPrev.addEventListener('click', () => {
        weekNavigation(-1, weeksByYear);
        planningFilter();
        loadDaysFilter();
    });
    if (btnNext) btnNext.addEventListener('click', () => {
        weekNavigation(1, weeksByYear);
        planningFilter();
        loadDaysFilter();
    });

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        planningFilter();
        loadDaysFilter();
    });
});

// Función de filtrado por valores seleccionados
export async function planningFilter() {
    // Verificar que existen los elementos
    const yearFilterEl = document.getElementById('year-filter');
    const weekFilterEl = document.getElementById('week-filter');
    const dayFilterEl = document.getElementById('day-filter');
    const clientFilterEl = document.getElementById('client-filter');

    if (!yearFilterEl || !weekFilterEl || !clientFilterEl || !dayFilterEl) return;

    // Tomar valores de los selects
    const yearFilter = parseInt(yearFilterEl.value);
    const weekFilter = parseInt(weekFilterEl.value);
    const dayFilter = dayFilterEl.value;
    const clientFilter = clientFilterEl.value;

    // Si no se selecciona una semana y un año generar tabla vacía
    if (!weekFilter || !yearFilter ) {
        renderTable([]);
        return;
    }

    // Obtener partidas
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por semana y año seleccionados
    const weeklyOrders = allPartitions.filter(o => o.semana == weekFilter && o.anio == yearFilter);
    // Si se selecciona un almacén, aplicarlo
    const filtered = weeklyOrders.filter(o => 
        (clientFilter === '0' || o.id_cliente == clientFilter) &&
        (dayFilter === '0' || o.fecha_programada === dayFilter));

    renderPlanningTable(filtered);
}
