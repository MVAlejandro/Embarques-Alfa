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
import { renderCanceledGraphic, renderClientsGraphic } from './js/components/index/resume-graphic.js';

document.addEventListener('DOMContentLoaded', async () => {
    const currentWeek = await obtainCurrentWeek();

    await initPage()
    createResumeCards(currentWeek)
    renderCanceledGraphic(currentWeek)
    renderClientsGraphic(currentWeek)
    
    Chart.register(ChartDataLabels);
})
