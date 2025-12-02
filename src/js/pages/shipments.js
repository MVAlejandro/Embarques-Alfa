// Estilos generales
import '../../css/style.css'
import '../../css/pages/shipments.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { initPageFilters } from '../utils/planning-filters.js'; 
import { renderShipmentsTable } from '../components/shipments/shipments-table.js'; 
import { renderShipmentsEditModal } from '../components/shipments/shipments-modal.js'; 

document.addEventListener('DOMContentLoaded', () => {
    // await initPage()
    // Generar tabla con semana actual
    initPageFilters(renderShipmentsTable);
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const orderData = JSON.parse(button.getAttribute('partition-data'));
    renderShipmentsEditModal(orderData);
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