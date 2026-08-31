// Servicios Supabase
import { getRejections } from '../../services/rejections-service.js'; 
import { renderRejectionsTable } from './rejections-table.js'; 
// Utilidades
import { loadProductsFilter } from '../../utils/load-select.js';

let allRejections = [];

// Función para cargar las opciones de filtrado
export async function initRejectionsFilters() {
    // Cargar filtros con valores iniciales
    flatpickr("#day-filter", {
        locale: {
            ...flatpickr.l10ns.es,
            firstDayOfWeek: 0
        },
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: [new Date(), new Date()]
    });

    // Render inicial
    await rejectionsFilter();

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        rejectionsFilter();
    });
}

// Función de filtrado por valores seleccionados
export async function rejectionsFilter() {
    const dayFilterEl = document.getElementById('day-filter');
    const clientFilterEl = document.getElementById('client-filter');
    const productFilterEl = document.getElementById('product-filter');

    // Valores por defecto si no existe alguno de los filtros
    const clientFilter = clientFilterEl.value.trim().toLowerCase();
    const productFilter = productFilterEl?.value || '0';

    let startDate = null;
    let endDate = null;

    if (dayFilterEl?.value) {
        const range = dayFilterEl.value.split(' a ');
        startDate = new Date(range[0]);
        endDate = range[1] ? new Date(range[1]) : startDate;
    }

    // Si no se selecciona un día generar tabla vacía
    if (!startDate) {
        renderRejectionsTable([]);
        return;
    }

    // Obtener registros
    allRejections = await getRejections();
        if (!allRejections) return;

    // Filtrar por rango de fechas
    let filtered = allRejections.filter(r => {
        const fecha = new Date(r.fecha_rechazo);
        return fecha >= startDate && fecha <= endDate;
    });
        
    // Filtrar por cliente
    filtered = filtered.filter(r => (clientFilter === '' || r.cliente.toString().toLowerCase().includes(clientFilter)));
    
    // Cargar productos solo si existe el select
    if (productFilterEl) {
        loadProductsFilter(filtered, productFilter);
    }
    
    if (productFilter !== '0') {
        const enriched = await Promise.all(
            filtered.map(async (rechazo) => {
                const productos = await getRejectionProducts(rechazo.id_rechazo);
                return { ...rechazo, productos };
            })
        );
    
        filtered = enriched.filter(rechazo =>
            rechazo.productos.some(prod => prod.id_producto == productFilter)
        );
    }
        
    renderRejectionsTable(filtered);
}