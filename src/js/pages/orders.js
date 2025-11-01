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
import { addManualOrder, addExcelOrder } from '../components/orders/orders-form.js';
import { ordersFilter } from '../components/orders/orders-filter.js';
import { renderOrdersTable } from '../components/orders/orders-table.js';
import { renderOrdersEditModal } from '../components/orders/orders-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    renderOrdersTable();
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        ordersFilter(e);
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

// Declarar los botones de editar
const editModal = document.getElementById('edit-modal');

editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const orderData = JSON.parse(button.getAttribute('order-data'));
    renderOrdersEditModal(orderData);

    // Limpiar el modal al cerrarlo
    editModal.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('#edit-modal input').forEach(input => (input.value = ''));
    });
});

// Declarar los botones de eliminar
const deleteModal = document.getElementById('delete-modal');

deleteModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const idOrder = button.dataset.id;
    document.getElementById('delete-id-order').value = idOrder;

    // Limpiar información al cerrar modal
    deleteModal.addEventListener('hidden.bs.modal', () => {
        document.getElementById('delete-id-order').value = '';
    });
});