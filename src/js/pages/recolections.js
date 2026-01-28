// Estilos generales
import '../../css/style.css'
import '../../css/pages/recolections.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/recolections/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addRecolection } from '../components/recolections/recolection-form.js';
import { recolectionsFilter } from '../components/recolections/recolections-filter.js';
import { renderRecolectionsEditModal } from '../components/recolections/recolections-modal.js'; 

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    await recolectionsFilter();
});

// Declarar el botón de filtrado
document.addEventListener('click', function(e) {
    if (e.target.id === 'filter-btn' || e.target.closest('#filter-btn')) {
        recolectionsFilter();
    }
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addRecolection(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const recolectionData = JSON.parse(button.getAttribute('recolection-data'));
    
    renderRecolectionsEditModal(recolectionData);
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