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
import { renderPlanningTable } from '../components/planning/planning-table.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initPageFilters(renderPlanningTable);
    await initPage()
});

// Recargar la página cada cierto tiempo de forma automática
  setInterval(async () => { await initPageFilters(renderPlanningTable); }, 420000); // 5 minutos = 300,000 ms
