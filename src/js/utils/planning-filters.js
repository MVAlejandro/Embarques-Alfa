// Servicios Supabase
import { getPartitionProducts } from '../services/partition-product-service.js';
// Utilidades
import { loadDaysFilter } from './load-select.js';

let allRegisters = [];

// Función para cargar las opciones de filtrado
export async function initPageFilters(getFunction, renderTable) {
    // Cargar filtros con valores iniciales
    loadDaysFilter()

    const param = new URLSearchParams(window.location.search);
    const client = param.get("client") || "";
    const product = param.get("product") || "0";
    const canceled = param.get("canceled") || "0";

    const clientFilterEl = document.getElementById('client-filter');
    const productFilterEl = document.getElementById("product-filter");
    const canceledFilterEl = document.getElementById('canceled-filter');
    
    // Solo establecer el valor si el filtro existe
    if (clientFilterEl) {
        clientFilterEl.value = client;
    }

    if (productFilterEl) {
        productFilterEl.value = product;
    }

    if (canceledFilterEl) {
        canceledFilterEl.value = canceled;
    }

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
    const canceledFilterEl = document.getElementById('canceled-filter');

    // Valores por defecto si no existe alguno de los filtros
    let clientFilter = '';
    if (clientFilterEl) {
        clientFilter = clientFilterEl.value.trim().toLowerCase();
    }
    const productFilter = productFilterEl?.value.toLowerCase() || '0';
    const canceledFilter = canceledFilterEl?.value || '0';

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

    // Filtrar por cancelados
    let filtered = allRegisters.filter(p => { 
        if (canceledFilter === '0') { 
            // Mostrar los que no están cancelados 
            return p.planta !== 'Cancelado'; 
        } 
        if (canceledFilter === '1') { 
            // Mostrar solamente los cancelados 
            return p.planta === 'Cancelado'; 
        } 
        return p.planta === canceledFilter; 
    });

    // Filtrar por rango de fechas
    filtered = filtered.filter(p => {
        const fecha = new Date(p.fecha_programada);
        return fecha >= startDate && fecha <= endDate;
    });

    // Filtrar por cliente
    filtered = filtered.filter(p => (clientFilter === '' || p.cliente.toString().toLowerCase().includes(clientFilter)));

    // Filtrar por producto
    if (productFilter !== '0') {
        const enriched = await Promise.all(
            filtered.map(async (partida) => {
                const productos = await getPartitionProducts(partida.id_partida);
                return { ...partida, productos };
            })
        );
        
        filtered = enriched.filter(partida =>
            partida.productos.some(prod => prod.producto?.toLowerCase().includes(productFilter))
        );
    }
        
    renderTable(filtered);
}