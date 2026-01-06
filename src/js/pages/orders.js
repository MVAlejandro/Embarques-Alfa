// Estilos generales
import '../../css/style.css'
import '../../css/pages/orders.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/orders/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addManualOrder, addExcelOrder } from '../components/orders/orders-form.js';
import { ordersFilter } from '../components/orders/orders-filter.js';
import { renderOrdersTable } from '../components/orders/orders-table.js';
import { renderOrdersEditModal } from '../components/orders/orders-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await renderOrdersTable();
    await initPage()
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        ordersFilter();
    }
});

// Declarar el botón del formulario manual
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-manual' || e.target.closest('#btn-add-manual')) {
        addManualOrder(e);
    }
});

// Declarar el botón del formulario Excel
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-excel' || e.target.closest('#btn-add-excel')) {
        addExcelOrder(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const orderData = JSON.parse(button.getAttribute('order-data'));
    renderOrdersEditModal(orderData);
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
