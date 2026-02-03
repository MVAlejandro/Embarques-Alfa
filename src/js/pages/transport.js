// Estilos generales
import '../../css/style.css'
import '../../css/pages/transport.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/transport/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { addTrip } from '../components/transport/transport-form.js';
import { initPageFilters, tripsFilter } from '../utils/planning-filters.js'; 
import { renderTransportTable } from '../components/transport/transport-table.js';
import { renderTransportEditModal } from '../components/transport/transport-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    await initPageFilters(tripsFilter, renderTransportTable);
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addTrip(e);
    }
});

// Acciones del modal de edición
const editModal = document.getElementById('edit-modal');
// Al abrir modal
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const tripData = JSON.parse(button.getAttribute('trip-data'));
    renderTransportEditModal(tripData);
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
