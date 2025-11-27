// Servicios Supabase
import { getPartitions } from '../services/partitions-service.js'; 
// Utilidades
import { loadOptions, loadOptionsFilter } from './load-select.js';
import { obtainLastWeek, buildWeeksByYear, weekNavigation } from '../utils/week-functions.js';

let weeksByYear = {};
let allPartitions = [];

// Función para cargar las opciones de filtrado
export async function initPageFilters(renderTable, statusField) {
    let lastWeek = await obtainLastWeek();
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
    await planningFilter(renderTable, statusField);

    // Navegación entre semanas
    if (btnPrev) btnPrev.addEventListener('click', () => weekNavigation(-1, weeksByYear, renderTable, statusField));
    if (btnNext) btnNext.addEventListener('click', () => weekNavigation(1, weeksByYear, renderTable, statusField));
}

// Función de filtrado por valores seleccionados
export async function planningFilter(renderTable, statusField) {
    // Verificar que existen los elementos
    const yearFilterEl = document.getElementById('year-filter');
    const weekFilterEl = document.getElementById('week-filter');
    const clientFilterEl = document.getElementById('client-filter');
    const statusFilterEl = document.getElementById('status-filter');

    if (!yearFilterEl || !weekFilterEl || !clientFilterEl || !statusFilterEl) return;

    // Tomar valores de los selects
    const yearFilter = parseInt(yearFilterEl.value);
    const weekFilter = parseInt(weekFilterEl.value);
    const clientFilter = clientFilterEl.value;
    const statusFilter = statusFilterEl.value;

    // Si no se selecciona una semana y un año generar tabla vacía
    if (!weekFilter || !yearFilter) {
        renderTable([]);
        return;
    }

    // Obtener órdenes
    allPartitions = await getPartitions();
        if (!allPartitions) return;

    // Filtrar por semana y año seleccionados
    const weeklyOrders = allPartitions.filter(o => o.semana == weekFilter && o.anio == yearFilter);
    // Si se selecciona un almacén, aplicarlo
    const filtered = weeklyOrders.filter(o => 
        (clientFilter === '0' || o.id_cliente == clientFilter) &&
        (statusFilter === '0' || o[statusField] === statusFilter));

    renderTable(filtered);
}
