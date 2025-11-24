// Estilos generales
import '../../css/style.css'
import '../../css/pages/bills.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPageFilters, planningFilter } from '../utils/planning-filters.js'; 
import { renderBillsTable } from '../components/bills/bills-table.js';
import { renderBillsEditModal } from '../components/bills/bills-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Generar tabla con semana actual
    initPageFilters(renderBillsTable, "facturacion");
    // Declarar el botón de filtrado
    document.getElementById("filter-btn").addEventListener("click", () => {
        planningFilter(renderProductionTable, "planta");
    });
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const orderData = JSON.parse(button.getAttribute('order-data'));
    renderBillsEditModal(orderData);
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
