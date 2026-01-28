// Estilos generales
import '../../css/style.css'
import '../../css/pages/suppliers.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/suppliers/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addManualSupplier, addExcelSupplier } from '../components/suppliers/suppliers-form.js';
import { searchFilter } from '../components/suppliers/suppliers-filter.js';
import { renderSuppliersTable } from '../components/suppliers/suppliers-table.js';
import { renderSuppliersEditModal } from '../components/suppliers/suppliers-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await renderSuppliersTable();
    await initPage()
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        searchFilter();
    }
});

// Declarar el botón del formulario manual
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-manual' || e.target.closest('#btn-add-manual')) {
        addManualSupplier(e);
    }
});
// Declarar el botón del formulario Excel
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-excel' || e.target.closest('#btn-add-excel')) {
        addExcelSupplier(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const supplierData = JSON.parse(button.getAttribute('supplier-data'));
    renderSuppliersEditModal(supplierData);
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
