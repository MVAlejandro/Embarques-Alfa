// Estilos generales
import '../../css/style.css'
import '../../css/pages/transport.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { renderTransportTable } from '../components/transport/transport-table.js'; 
import { renderTransportEditModal } from '../components/transport/transport-modal.js'; 

document.addEventListener('DOMContentLoaded', () => {
    renderTransportTable();
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const orderData = JSON.parse(button.getAttribute('order-data'));
    renderTransportEditModal(orderData);
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
