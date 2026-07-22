// Servicios Supabase
import { getPartitionProducts } from '../services/partition-product-service.js';

// Utilidades
import { loadClientsFilter, loadDaysFilter, loadProductsFilter } from './load-select.js';

let allRegisters = [];

// Función para cargar las opciones de filtrado
export async function initPageFilters(getFunction, renderTable) {
    // Cargar filtros con valores iniciales
    loadDaysFilter()

    // Render inicial
    await planningFilter(getFunction, renderTable);

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) filterBtn.addEventListener('click', () => {
        planningFilter(getFunction, renderTable);
    });
}

// Función de filtrado por valores seleccionados
export async function planningFilter(getFunction, renderTable) {
    // Verificar que existen los elementos
    const dayFilterEl = document.getElementById('day-filter');
    const clientFilterEl = document.getElementById('client-filter');
    const productFilterEl = document.getElementById('product-filter');
    const projectionFilterEl = document.getElementById('projection-filter');

    // Valores por defecto si no existe alguno de los filtros
    const clientFilter = clientFilterEl?.value || '0';
    const productFilter = productFilterEl?.value || '0';
    const projectionFilter = projectionFilterEl?.value || '0';

    let startDate = null;
    let endDate = null;

    if (dayFilterEl?.value) {
        const range = dayFilterEl.value.split(' a ');
        startDate = new Date(range[0]);
        endDate = range[1] ? new Date(range[1]) : startDate;
    }

    // Si no se selecciona un día generar tabla vacía
    if (!startDate) {
        renderTable([]);
        return;
    }

    // Obtener registros
    allRegisters = await getFunction();
        if (!allRegisters) return;

    // Filtrar por rango de fechas
    let filtered = allRegisters.filter(p => {
        const fecha = new Date(p.fecha_programada);
        return fecha >= startDate && fecha <= endDate;
    });
    
    // Cargar clientes solo si existe el select
    if (clientFilterEl) {
        loadClientsFilter(filtered, clientFilter);
    }

    filtered = filtered.filter(p => (clientFilter === '0' || p.id_cliente == clientFilter));

    // Cargar productos solo si existe el select
    if (productFilterEl) {
        loadProductsFilter(filtered, productFilter);
    }

    if (productFilter !== '0') {
        const enriched = await Promise.all(
            filtered.map(async (partida) => {
                const productos = await getPartitionProducts(partida.id_partida);
                return { ...partida, productos };
            })
        );

        filtered = enriched.filter(partida =>
            partida.productos.some(prod => prod.id_producto == productFilter)
        );
    }

    // Filtrar por proyectados
    filtered = filtered.filter(p => (projectionFilter === '0' || p.embarque !== projectionFilter));
        
    renderTable(filtered);
}