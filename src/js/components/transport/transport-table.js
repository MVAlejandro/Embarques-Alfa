// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { getRecolections } from '../../services/recolections-service.js'
import { getPartitionProducts } from '../../services/partition-product-service.js';
import { getRecolectionProducts } from '../../services/recolection-product-service.js';
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];
let allRecolections = [];

// Función para crear la tabla de partidas
export async function renderPartitionTransportTable(partitionsParam = null) {
    // Obtener partidas si no se pasa una lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    } else {
        allPartitions = await getPartitions();
    }

    // Filtrar los registros que no tengan un viaje asignado y los que no estén cancelados
    allPartitions = allPartitions.filter(p => !p.id_viaje);
    allPartitions = allPartitions.filter(p => p.planta !== "Cancelado" && p.planta !== "Proyectado");
    
    const tbody = document.querySelector('#partitions-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    tbody.innerHTML = '';
    weekText.innerHTML = "Semana 0";

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas sin asignar</td></tr>`;
        return;
    }

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;

    // Calcular total de cantidades
    let totalGeneral = 0;

    for (const partida of allPartitions) {
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);
        // Calcular total de cantidades
        const partitionsTotal = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);

        totalGeneral += partitionsTotal;

        tbody.innerHTML += 
        `<tr>
            <td class="transport-time p-2 text-center">${partida.hora_programada.slice(0, 5)}</td>
            <td class="transport-client p-2 ${partida.embarque === "Proyectado" ? "text-primary" : ""}">${partida.cliente}</td>
            <td class="transport-cant fw-bold p-2 ${partida.embarque === "Proyectado" ? "text-primary" : ""}">Cant. ${partitionsTotal}</td>
            <td class="transport-destination p-2">${partida.destino || partida.ubicacion}</td>
            <td class="transport-control text-center d-none" data-trans-only>
                <button class="btn btn-primary btn-update-partition" 
                    data-bs-target="#asign-modal" 
                    data-bs-toggle="modal"
                    register-data='${JSON.stringify(partida)}'>
                    Asignar
                </button>
            </td>
        </tr>`;
    };

    validateUserRole()
}

// Función para crear la tabla de recolecciones
export async function renderRecolectionTransportTable(recolectionsParam = null) {
    // Obtener recolecciones si no se pasa una lista filtrada
    if (recolectionsParam) {
        allRecolections = recolectionsParam;
    } else {
        allRecolections = await getRecolections();
    }

    // Filtrar los registros que no tengan un viaje asignado
    allRecolections = allRecolections.filter(r => !r.id_viaje);
    allRecolections = allRecolections.filter(r => r.transporte !== "Cancelado");
    
    const tbody = document.querySelector('#recolections-table tbody');
    // Limpiar elementos antes de insertar
    tbody.innerHTML = '';

    if (!allRecolections || allRecolections.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay recolecciones sin asignar</td></tr>`;
        return;
    }

    // Calcular total de cantidades
    let totalGeneral = 0;

    for (const recoleccion of allRecolections) {
        // Obtener productos de la partida
        const productos = await getRecolectionProducts(recoleccion.id_recoleccion);
        // Calcular total de cantidades
        const recolectionsTotal = productos.reduce((acc, prod) => acc + (prod.cantidad_recoleccion || 0), 0);

        totalGeneral += recolectionsTotal;

        tbody.innerHTML += 
        `<tr>
            <td class="transport-time p-2 text-center">${recoleccion.hora_programada.slice(0, 5)}</td>
            <td class="transport-client p-2">${recoleccion.proveedor}</td>
            <td class="transport-cant fw-bold p-2">Cant. ${recolectionsTotal}</td>
            <td class="transport-destination p-2">${recoleccion.destino || recoleccion.ubicacion}</td>
            <td class="transport-control text-center d-none" data-trans-only>
                <button class="btn btn-primary btn-update-partition" 
                    data-bs-target="#asign-modal" 
                    data-bs-toggle="modal"
                    register-data='${JSON.stringify(recoleccion)}'>
                    Asignar
                </button>
            </td>
        </tr>`;
    };

    validateUserRole()
}