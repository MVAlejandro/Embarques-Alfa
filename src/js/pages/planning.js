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
import { renderPlanningTable, getPartitionById } from '../components/planning/planning-table.js';
import { renderProductionModal, renderTransportModal, renderShipmentsModal, renderBillsModal } from '../components/planning/planning-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPageFilters(renderPlanningTable);
    await initPage()
});

// Recargar la página cada cierto tiempo de forma automática
  setInterval(async () => { await initPageFilters(renderPlanningTable); }, 60000); // 5 minutos = 300,000 ms

// Llenar el modal de transporte
const productionModal = document.getElementById('production-modal');

productionModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.partitionId;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderProductionModal(partida);
});

// Llenar el modal de transporte
const transportModal = document.getElementById('transport-modal');

transportModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.partitionId;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderTransportModal(partida);
});

// Llenar el modal de embarques
const shipmentModal = document.getElementById('shipment-modal');

shipmentModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.partitionId;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderShipmentsModal(partida);
});

// Llenar el modal de facturación
const billModal = document.getElementById('bill-modal');

billModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const row = button.closest('tr');
    const id = row.dataset.partitionId;

    const partida = getPartitionById(id);
    if (!partida) return;

    renderBillsModal(partida);
});
