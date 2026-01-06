// Servicios Supabase
import { getClients } from '../../services/clients-service.js';
import { renderClientsTable } from './clients-table.js';

let allClients = [];

// Función de filtrado por búsqueda
export async function searchFilter() {
    const searchText = document.getElementById('search-filter').value.trim().toLowerCase();
    // Obtener clientes
    allClients = await getClients();
        if (!allClients) return;

    // Si no hay filtros activos, mostrar todo
    if (searchText === '') {
        renderClientsTable(allClients);
        return;
    }

    // Aplicar filtros
    const filtered = allClients.filter(c => {
        // Filtro por búsqueda de nombre
        const searchOk = searchText === '' || c.razon_social?.toString().toLowerCase().includes(searchText) || c.nombre?.toString().toLowerCase().includes(searchText);;

        return searchOk;
    });

    renderClientsTable(filtered);
}
