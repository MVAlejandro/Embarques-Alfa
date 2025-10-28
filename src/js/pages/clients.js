// Estilos generales
import '../../css/style.css'
import '../../css/pages/clients.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/clients/clients-form.js'

// Servicios Supabase
import { renderClientsTable } from '../components/clients/clients-table.js';
import { renderClientsEditModal } from '../components/clients/clients-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    renderClientsTable();
});

// Declarar los botones de editar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-edit')) {
        const clientData = JSON.parse(e.target.getAttribute('data-cliente'));
        renderClientsEditModal(clientData);
    }
});

// Declarar los botones de eliminar
// Eliminar entrada al dar click en el botón del segundo modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const clientId = JSON.parse(e.target.getAttribute('data-cliente')).id_cliente;

    // deleteClient(clientId)
});
