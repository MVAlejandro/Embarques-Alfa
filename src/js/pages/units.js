// Estilos generales
import '../../css/style.css'
import '../../css/pages/units.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/units/generate-form.js'

// Servicios Supabase
import { addManualUnit, addExcelUnit } from '../components/units/units-form.js';
import { unitsFilter } from '../components/units/units-filter.js'; 
import { renderUnitsTable } from '../components/units/units-table.js';
import { renderUnitsEditModal } from '../components/units/units-modal.js';

document.addEventListener('DOMContentLoaded', () => {
    renderUnitsTable();
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        unitsFilter(e);
    }
});

// Declarar el botón del formulario manual
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-manual' || e.target.closest('#btn-add-manual')) {
        addManualUnit(e);
    }
});
// Declarar el botón del formulario Excel
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add-excel' || e.target.closest('#btn-add-excel')) {
        addExcelUnit(e);
    }
});

// Declarar los botones de editar
const editModal = document.getElementById('edit-modal');

editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const unitData = JSON.parse(button.getAttribute('unit-data'));
    renderUnitsEditModal(unitData);

    // Limpiar el modal al cerrarlo
    editModal.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('#edit-modal input').forEach(input => (input.value = ''));
    });
});

// Declarar los botones de eliminar
const deleteModal = document.getElementById('delete-modal');

deleteModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const idUnit = button.dataset.id;
    document.getElementById('delete-id-unit').value = idUnit;

    // Limpiar información al cerrar modal
    deleteModal.addEventListener('hidden.bs.modal', () => {
        document.getElementById('delete-id-unit').value = '';
    });
});
