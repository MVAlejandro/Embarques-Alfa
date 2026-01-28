// Servicios Supabase
import { getSession, getUserProfile } from '../../services/login-service.js';
import { getRecolections} from '../../services/recolections-service.js'; 
import { getRecolectionProducts } from '../../services/recolection-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allRecolections = [];

// Función para crear la tabla
export async function renderRecolectionsTable(recolectionsParam = null) {
    // Obtener recolecciones si no se pasa una lista filtrada
    if (recolectionsParam) {
        allRecolections = recolectionsParam;
    } else {
        allRecolections = await getRecolections();
    }

    // Ordenar el arreglo completo antes de generar la tabla
    allRecolections.sort((a, b) => {
        const dateA = new Date(`${a.fecha_programada}T${a.hora_programada}`);
        const dateB = new Date(`${b.fecha_programada}T${b.hora_programada}`);
        return dateA - dateB;
    });
    
    const tbody = document.querySelector('#recolections-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allRecolections || allRecolections.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay recolecciones registradas</td></tr>`;
        return;
    }

    let totalGeneral = 0;

    weekText.innerHTML = `Semana ${allRecolections[0].semana}`;
    
    for (const recoleccion of allRecolections) {
        // Determinar clase CSS para el estatus
        let statusClass = '';
        if (recoleccion.transporte == 'Asignado') {
            statusClass = 'greenL';
        } else if (recoleccion.transporte == 'En ruta') {
            statusClass = 'yellow';
        } else if (recoleccion.transporte == 'Recolectado') {
            statusClass = 'greenD';
        } else if (recoleccion.transporte == 'Cancelado') {
            statusClass = 'red';
        } else {
            statusClass = 'grey';
        }

        // Obtener productos de la recoleccion
        const productos = await getRecolectionProducts(recoleccion.id_recoleccion);
        // Calcular total de cantidades
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_recoleccion || 0), 0);

        totalGeneral += totalAmount;

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="recolection-date fw-bold">${recoleccion.fecha_programada}</p>
                <p class="recolection-time">${recoleccion.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="recolection-supplier p-2">${recoleccion.proveedor}</td>
            <td id="recolection-products-${recoleccion.id_recoleccion}" class="p-2">

            </td>
            <td class="text-center p-2">
                <p class="recolection-status ${statusClass}">${recoleccion.transporte}</p>
            </td>
            <td class="recolection-destination p-2">${recoleccion.destino || recoleccion.ubicacion}</td>
            <td class="recolection-control text-center d-none" data-comp-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${recoleccion.transporte === "Recolectado" || recoleccion.transporte === "Cancelado" ? "disabled" : ""}
                    recolection-data='${JSON.stringify(recoleccion)}'>
                    ${recoleccion.transporte === "Recolectado" ? "Completado" : recoleccion.transporte === "Cancelado" ? "Cancelado" :"Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta recoleccion
        const container = document.getElementById(`recolection-products-${recoleccion.id_recoleccion}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="recolection-product">${producto.codigo} - <b> Cant. ${producto.cantidad_recoleccion.toLocaleString('en-US')}</b></p>
            <p class="recolection-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active fw-bold">
        <td colspan="2" class="text-center">Tarimas Totales</td>
        <td class="p-2">${totalGeneral.toLocaleString('en-US')}</td>
        <td colspan="3"></td>
    </tr>`;

    validateUserRole()

    try {
        // Si no hay sesión, no hacer nada
        const session = await getSession();
        if (!session) return;
        
        // Obtener el rol "admin", "colab", etc.
        const rol = await getUserProfile(session);
        if (!rol) return;
    
        if (rol === 'comp') {
            // Habilitar todos los botones desactivados
            document.querySelectorAll('button:disabled').forEach(el => {
                el.disabled = false;
            });
        } 
        
    } catch (error) {
        console.error('Error validando rol del usuario:', error);
    }
}
