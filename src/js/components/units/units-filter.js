// Servicios Supabase
import { getUnits, getBoxes } from '../../services/units-service.js';
import { renderUnitsTable } from './units-table.js';

let allUnits = [];

// Función de filtrado por búsqueda
export async function unitsFilter() {
    const typeFilter = document.getElementById('type-filter').value;
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();

    // Obtener unidades
    const [units, boxes] = await Promise.all([ getUnits(), getBoxes() ]);
    
    allUnits = [
        ...units.map(u => ({ ...u, tipo: u.tipo })),
        ...boxes.map(b => ({ ...b, tipo: "Caja" }))
    ];

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
