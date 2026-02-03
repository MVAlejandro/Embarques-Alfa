// Servicios Supabase
import { getSession, getUserProfile } from '../../services/login-service.js';
import { getPartitions } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js'; 
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];

// Función para crear la tabla y la paginación
export async function renderPartitionsTable(partitionsParam = null) {
    // Obtener partidas si no se pasa una lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    } else {
        allPartitions = await getPartitions();
    }

    // Ordenar el arreglo completo antes de generar la tabla
    allPartitions.sort((a, b) => {
        const dateA = new Date(`${a.fecha_programada}T${a.hora_programada}`);
        const dateB = new Date(`${b.fecha_programada}T${b.hora_programada}`);
        return dateA - dateB;
    });
    
    const tbody = document.querySelector('#partitions-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    let totalGeneral = 0;

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;
    
    for (const partida of allPartitions) {
        let statusClass = '';
        if (partida.transporte == 'Asignado') {
            statusClass = 'greenL';
        } else if (partida.transporte == 'Planeado') {
            statusClass = 'grey';
        } else if (partida.transporte == 'En ruta') {
            statusClass = 'yellow';
        } else if (partida.transporte == 'Entregado') {
            statusClass = 'greenD';
        } else {
            statusClass = 'red';
        }

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);

        totalGeneral += totalAmount;

        tbody.innerHTML += 
        `<tr>
            <td class="p-2 ps-4">
                <p class="partition-date fw-bold">${partida.fecha_programada}</p>
                <p class="partition-time">${partida.hora_programada.slice(0, 5)}</p>
            </td>
            <td class="partition-client p-2">${partida.cliente}</td>
            <td id="partition-products-${partida.id_partida}" class="p-2">

            </td>
            <td class="text-center p-2">
                <p class="partition-status ${statusClass}">${partida.transporte}</p>
            </td>
            <td class="partition-destination p-2">${partida.destino || partida.ubicacion}</td>
            <td class="partition-control text-center d-none" data-vent-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.planta === "Terminado" || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.planta === "Terminado" ? "Completado" : partida.planta === "Cancelado" ? "Cancelado" :"Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta partida
        const container = document.getElementById(`partition-products-${partida.id_partida}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="partition-product">${producto.codigo} - <b> Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="partition-cant">${producto.producto}</p>
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
    
        if (rol === 'vent') {
            // Habilitar todos los botones desactivados
            document.querySelectorAll('button:disabled').forEach(el => {
                el.disabled = false;
            });
        } 
        
    } catch (error) {
        console.error('Error validando rol del usuario:', error);
    }
}
