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
import { getPartitions } from '../services/partitions-service.js';
import { getRecolections } from '../services/recolections-service.js';
import { getTrips } from '../services/trips-service.js';
import { addTrip } from '../components/transport/transport-form.js';
import { initPageFilters } from '../utils/planning-filters.js';
import { renderPartitionTransportTable, renderRecolectionTransportTable } from '../components/transport/transport-table.js';
import { renderTripsTable } from '../components/trips/trips-table.js';
import { renderTransportAsignModal } from '../components/transport/transport-modal.js';
import { renderTripEditModal } from '../components/trips/trips-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    await initPageFilters(getPartitions, renderPartitionTransportTable)
    await initPageFilters(getRecolections, renderRecolectionTransportTable)
    await initPageFilters(getTrips, renderTripsTable);
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addTrip(e);
    }
});

// Acciones del modal de asignación de eventos
const asignModal = document.getElementById('asign-modal');
// Al abrir modal
asignModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const registerData = JSON.parse(button.getAttribute('register-data'));
    renderTransportAsignModal(registerData);
});
// Al cerrar modal
asignModal.addEventListener('hidden.bs.modal', () => {
    asignModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    asignModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});

// Acciones del modal de edición de viajes
const tripModal = document.getElementById('trip-modal');
// Al abrir modal
tripModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    const tripData = JSON.parse(button.getAttribute('trip-data'));
    renderTripEditModal(tripData);
});
// Al cerrar modal
tripModal.addEventListener('hidden.bs.modal', () => {
    tripModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    tripModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});
