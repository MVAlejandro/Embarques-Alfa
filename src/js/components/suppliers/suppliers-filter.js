// Servicios Supabase
import { getSuppliers } from '../../services/suppliers-service.js'; 
import { renderSuppliersTable } from './suppliers-table.js'; 

let allSuppliers = [];

// Función de filtrado por búsqueda
export async function searchFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    // Obtener clientes
    allSuppliers = await getSuppliers();
        if (!allSuppliers) return;

    // Si no hay filtros activos, mostrar todo
    if (searchText === '') {
        renderSuppliersTable(allSuppliers);
        return;
    }

    // Aplicar filtros
    const filtered = allSuppliers.filter(s => {
        // Filtro por búsqueda de nombre
        const searchOk = searchText === '' || s.razon_social?.toString().toLowerCase().includes(searchText) || s.nombre?.toString().toLowerCase().includes(searchText);;

        return searchOk;
    });

    renderSuppliersTable(filtered);
}
