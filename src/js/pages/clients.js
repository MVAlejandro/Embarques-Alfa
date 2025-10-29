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
        const clientData = JSON.parse(e.target.getAttribute('client-data'));
        renderClientsEditModal(clientData);
    }
});

// Declarar los botones de eliminar
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-delete')) {
        const idClient = e.target.dataset.id;
        document.getElementById('delete-id-cliente').value = idClient;
    }
});
