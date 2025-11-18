// Servicios Supabase
import { getUnits } from '../../services/units-service.js';
import { renderUnitsTable } from './units-table.js';

let allUnits = [];

// Función de filtrado por búsqueda
export async function unitsFilter(event) {
    event.preventDefault();
    
    const typeFilter = document.getElementById('type-filter').value;
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();

    // Obtener unidades
    allUnits = await getUnits();
        if (!allUnits) return;

    // Si no hay filtros activos, mostrar todo
    const filterClean = typeFilter === '0' && searchText === '';

    if (filterClean) {
        renderUnitsTable(allUnits);
        return;
    }

    // Aplicar filtros
    const filtered = allUnits.filter(u => {
        const typeOk = typeFilter === '0' || u.tipo == typeFilter;
        const searchOk = searchText === '' || u.nombre?.toString().toLowerCase().includes(searchText);

        return typeOk && searchOk;
    });

    renderUnitsTable(filtered);
}
