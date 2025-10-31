// Servicios Supabase
import { getClients } from '../../services/client-service.js';
import { renderClientsTable } from './clients-table.js';

let allClients = [];

// Función de filtrado por búsqueda
export async function searchFilter(event) {
    event.preventDefault();
    
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
        let searchOk = true;

        // Filtro por búsqueda libre
        if (searchText) {
            searchOk = Object.values(c).some(valor =>
                valor?.toString().toLowerCase().includes(searchText)
            );
        }

        return searchOk;
    });

    renderClientsTable(filtered);
}
