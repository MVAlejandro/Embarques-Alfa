// Estilos generales
import '../../css/style.css'
import '../../css/pages/partitions.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';
import '../components/partitions/generate-form.js'

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { getPartitions } from '../services/partitions-service.js';
import { addPartition } from '../components/partitions/partitions-form.js';
import { initPageFilters } from '../utils/planning-filters.js'; 
import { renderPartitionsTable } from '../components/partitions/partitions-table.js'; 
import { renderPartitionsEditModal } from '../components/partitions/partitions-modal.js'; 
import { renderRejectionInfoModal } from '../components/partitions/rejection-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()

    // Generar tabla con el día actual
    await initPageFilters(getPartitions,renderPartitionsTable);
});

// Declarar el botón del formulario
document.addEventListener('click', function(e) {
    if (e.target.id === 'btn-add' || e.target.closest('#btn-add')) {
        addPartition(e);
    }
});

// Declarar los modales de edición e información
const editModal = document.getElementById('edit-modal');
const rejectionOffCanvas = document.getElementById('rejection');

let partitionData = null;

// Edición - Apertura
editModal.addEventListener('shown.bs.modal', event => {
    const button = event.relatedTarget;
    partitionData = JSON.parse(button.getAttribute('partition-data'));
    
    renderPartitionsEditModal(partitionData);
    renderRejectionInfoModal(partitionData);
});
// Edición - Cierre
editModal.addEventListener('hidden.bs.modal', () => {
    editModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    editModal.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });

    rejectionOffCanvas.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    rejectionOffCanvas.querySelectorAll('input, select').forEach(el => {
        el.value = '';
    });
});
