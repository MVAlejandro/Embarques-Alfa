// Estilos generales
import './css/style.css';
import './css/pages/index.css';

// Estilos de componentes
import './css/components/navbar.css';
import './css/components/footer.css';

// Componentes JS
import './js/components/navbar.js';

// Servicios Supabase
import { initPage } from './js/utils/session-validate.js';
import { createResumeCards } from './js/components/index/resume-cards.js';

// Utilidades
import { obtainCurrentWeek } from './js/utils/week-functions.js'; 
import { renderStatusGraphic, renderClientsGraphic } from './js/components/index/resume-graphic.js';
import { renderProductionState, renderShipmentsState } from './js/components/index/resume-stats.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentWeek = await obtainCurrentWeek();

    await initPage()
    createResumeCards(currentWeek)
    renderStatusGraphic(currentWeek)
    renderProductionState(currentWeek)
    renderClientsGraphic(currentWeek)
    renderShipmentsState(currentWeek)
    
    Chart.register(ChartDataLabels);
})
