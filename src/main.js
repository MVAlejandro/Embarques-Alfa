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
import { obtainLastWeek } from './js/utils/week-functions.js'; 
import { renderCanceledGraphic, renderClientsGraphic } from './js/components/index/resume-graphic.js';

document.addEventListener('DOMContentLoaded', async () => {
    const lastWeek = await obtainLastWeek();

    await initPage()
    createResumeCards(lastWeek)
    renderCanceledGraphic(lastWeek)
    renderClientsGraphic(lastWeek)
    
    // Chart.register(ChartDataLabels);
})
