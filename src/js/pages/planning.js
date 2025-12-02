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
import { planningFilter } from '../components/planning/planning-filters.js';

document.addEventListener('DOMContentLoaded', async () => {
    // await initPage()
});
