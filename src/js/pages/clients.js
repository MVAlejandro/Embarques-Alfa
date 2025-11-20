// Estilos generales
import '../../css/style.css'
import '../../css/pages/clients.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/clients/generate-form.js'

// Servicios Supabase
import { addManualClient, addExcelClient } from '../components/clients/clients-form.js';
import { searchFilter } from '../components/clients/clients-filter.js';
import { renderClientsTable } from '../components/clients/clients-table.js';
import { renderClientsEditModal } from '../components/clients/clients-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    renderClientsTable();
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        searchFilter(e);
    }
});

// Declarar el botón del formulario manual
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-manual' || e.target.closest('#btn-add-manual')) {
        addManualClient(e);
    }
});
// Declarar el botón del formulario Excel
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-excel' || e.target.closest('#btn-add-excel')) {
        addExcelClient(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const clientData = JSON.parse(button.getAttribute('client-data'));
    renderClientsEditModal(clientData);
});
// Al cerrar modal
editModal.addEventListener('hidden.bs.modal', () => {
    editModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    editModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});

// Acciones del modal de eliminación
const deleteModal = document.getElementById('delete-modal');
// Al abrir modal
deleteModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const idClient = button.dataset.id;
    document.getElementById('delete-id-client').value = idClient;
});
// Al cerrar modal
deleteModal.addEventListener('hidden.bs.modal', () => {
    document.getElementById('delete-id-client').value = '';
});
