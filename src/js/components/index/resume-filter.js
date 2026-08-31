// Servicios Supabase
import { createResumeCards } from './resume-cards.js'; 
import { renderStatusGraphic, renderClientsGraphic, renderRejectionsGraphic } from './resume-graphic.js';
import { renderProductsState } from './resume-stats.js';
// Utilidades
import { loadWeeksFilter } from "../../utils/load-select.js"; 

// Función para cargar las opciones de filtrado
export async function initIndexFilters() {
    // Cargar filtros con valores iniciales
    loadWeeksFilter()

    // Render inicial
    await indexFilter();

    // Escuchar los cambios en tiempo real de los inputs
    const filterIn = document.getElementById('day-filter');
    filterIn.addEventListener('change', indexFilter);
}

// Función de filtrado por valores seleccionados
export async function indexFilter() {
    // Verificar que existen los elementos
    const dayFilterEl = document.getElementById('day-filter');

    let startDate = null;
    let endDate = null;

    if (dayFilterEl?.value) {
        const range = dayFilterEl.value.split(' a ');
        startDate = new Date(range[0]);
        endDate = range[1] ? new Date(range[1]) : startDate;
    }

    // Si no se selecciona un día generar tabla vacía
    if (!startDate) {
        return;
    }

    createResumeCards(startDate, endDate)
    renderStatusGraphic(startDate, endDate)
    renderProductsState(startDate, endDate)
    renderClientsGraphic(startDate, endDate)
    renderRejectionsGraphic(startDate, endDate)
        
    Chart.register(ChartDataLabels);
}