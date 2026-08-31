// Estilos generales
import '../../css/style.css'
import '../../css/pages/rejections.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js'; 
import { initRejectionsFilters } from '../components/rejections/rejections-filter.js'; 
// import { renderRejectionsEditModal } from '../components/rejections/rejections-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    initRejectionsFilters();
});

// Acciones del modal de edición
// const editModal = document.getElementById('edit-modal');
// // Al abrir modal
// editModal.addEventListener('shown.bs.modal', event => {
//     const button = event.relatedTarget;
//     const rejectionData = JSON.parse(button.getAttribute('rejection-data'));
//     renderRejectionsEditModal(rejectionData);
// });
// // Al cerrar modal
// editModal.addEventListener('hidden.bs.modal', () => {
//     editModal.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
//         e.classList.remove('is-valid', 'is-invalid');
//     });

//     editModal.querySelectorAll('input, select').forEach(el => {
//         el.value = '';
//     });
// });
