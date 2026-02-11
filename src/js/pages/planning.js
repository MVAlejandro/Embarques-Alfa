// Estilos generales
import '../../css/style.css'
import '../../css/pages/planning.css'

// Estilos de componentes
import '../../css/components/navbar.css'
import '../../css/components/footer.css'

// Componentes JS
import '../components/navbar.js';

// Servicios Supabase
import { initPage } from '../utils/session-validate.js';
import { initPageFilters } from '../utils/planning-filters.js'; 
import { renderPlanningTable, getPartitionById, getRecolectionById, getTripById } from '../components/planning/planning-table.js';
import { renderProductionModal, renderTransportModal, renderTransportInput, renderShipmentsModal, renderBillsModal, renderRecolectionsModal } from '../components/planning/planning-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPage()
    // Generar tabla con el día actual
    await initPageFilters(renderPlanningTable);
});

// Recargar la página cada cierto tiempo de forma automática
  // setInterval(async () => { await planningFilter(renderPlanningTable); }, 60000); // 5 minutos = 300,000 ms

// Llenar el modal de producción
const productionModal = document.getElementById('production-modal');

productionModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.idPartition;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderProductionModal(partida);
});

// Llenar el modal de transporte
const transportModal = document.getElementById('transport-modal');

transportModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.idPartition;

    const viaje = getTripById(id);
    if (!viaje) return;
    const partida = getPartitionById(id);
    if (!partida) return;

    renderTransportModal(viaje);
    renderTransportInput(partida)
});

// Llenar el modal de embarques
const shipmentModal = document.getElementById('shipment-modal');

shipmentModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.idPartition;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderShipmentsModal(partida);
});

// Llenar el modal de facturación
const billModal = document.getElementById('bill-modal');

billModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.idPartition;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderBillsModal(partida);
});

// Llenar el modal de recolección
const recolectionModal = document.getElementById('recolection-modal');

recolectionModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.idRecolection;

    const recoleccion = getRecolectionById(id);
    if (!recoleccion) return;

    renderRecolectionsModal(recoleccion);
});
