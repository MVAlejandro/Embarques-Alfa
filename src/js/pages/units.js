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
import { initPage } from '../utils/session-validate.js'; 
import { addManualUnit, addExcelUnit } from '../components/units/units-form.js';
import { unitsFilter } from '../components/units/units-filter.js'; 
import { renderUnitsTable } from '../components/units/units-table.js';
import { renderUnitsEditModal } from '../components/units/units-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await renderUnitsTable();
    await initPage()
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        unitsFilter();
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

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const unitData = JSON.parse(button.getAttribute('unit-data'));
    renderUnitsEditModal(unitData);
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
