// Servicios Supabase
import { getFullTrips } from '../../services/trips-service.js';
import { addEventTableRow } from '../../utils/trip-table-row.js';
import { planningReport } from './planning-report.js';

let allTrips = [];

// Función para buscar la partida por id
export function getPartitionById(id) {
    return allTrips.flatMap(t => t.partidas ?? []).find(p => p.id_partida == id);
}

// Función para buscar la recolección por id
export function getRecolectionById(id) {
    return allTrips.flatMap(t => t.recolecciones ?? []).find(r => r.id_recoleccion == id);
}

// Función para buscar el viaje por id
export function getTripById(id) {
    for (const viaje of allTrips) {
        const partida = viaje.partidas?.find(p => p.id_partida == id);
        if (partida) {
            return viaje;
        }
    }
    return null;
}

// Función para crear la tabla y la paginación
export async function renderPlanningTable(tripsParam = null) {
    // Obtener viajes si no se pasa una lista filtrada
    if (tripsParam) {
        allTrips = tripsParam;
    } else {
        allTrips = await getFullTrips();
    }
    
    const tbody = document.querySelector('#planning-table tbody');
    const thead = document.getElementById('planning-total-container');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    thead.innerHTML = '';
    tbody.innerHTML = '';

    if (!allTrips || allTrips.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="10">No hay viajes registrados</td></tr>`;
        return;
    }

    let totalTarimas = 0;
    let totalMarcos = 0;
    let totalRecolecciones = 0;
    let totalCancelado = 0;

    // Colocar la semana del primer viaje
    weekText.innerHTML = `Semana ${allTrips[0].semana}`;

    for (let i = 0; i < allTrips.length; i++) {
        const viaje = allTrips[i];
        const hideHead = i !== 0 ? 'd-none' : '';

        if (viaje.estado === "Cancelado") {
            tbody.innerHTML += 
            `<tr>
                <td class="p-2 ps-4">
                    <p class="planning-date fw-bold">${viaje.fecha_programada}</p>
                    <p class="planning-time">${viaje.hora_programada.slice(0, 5)}</p>
                </td>
                <td class="planning-type p-2 fst-italic">${viaje.tipo}</td>
                <td class="planning-events p-2">
                    <p class="planning-partitions ${viaje.tipo === "Recolección" ? "d-none" : ""}">Partidas: ${viaje.partidas.length || "-"}</p>
                    <p class="planning-recolections ${viaje.tipo === "Partida" ? "d-none" : ""}">Recolecciones: ${viaje.recolecciones.length || "-"}</p>
                </td>
                <td class="text-center p-0 red">
                    <p class="pt-3 fw-semibold">Viaje cancelado</p>
                </td>
            </tr>`;
        } else if (viaje.estado !== "Cancelado") {
            tbody.innerHTML += 
            `<tr>
                <td class="p-2 ps-4">
                    <p class="planning-date fw-bold">${viaje.fecha_programada}</p>
                    <p class="planning-time">${viaje.hora_programada.slice(0, 5)}</p>
                </td>
                <td class="planning-type p-2 fst-italic">${viaje.tipo}</td>
                <td class="planning-events p-2">
                    <p class="planning-partitions ${viaje.tipo === "Recolección" ? "d-none" : ""}">Partidas: ${viaje.partidas.length || "-"}</p>
                    <p class="planning-recolections ${viaje.tipo === "Partida" ? "d-none" : ""}">Recolecciones: ${viaje.recolecciones.length || "-"}</p>
                </td>
                <td class="planning-events p-2">
                    <div class="planning-partitions p-0 ${viaje.tipo === "Recolección" ? "d-none" : ""}">
                        <table id="partition-table-${viaje.id_viaje}" class="table table-sm fixed-table mb-0">
                            <thead class="${hideHead}">
                                <tr class="table-light">
                                    <th class="text-center p-1">HORA</th>
                                    <th class="p-1 ps-2">CLIENTE</th>
                                    <th class="text-center p-1">PRODUCCIÓN</th>
                                    <th class="text-center p-1">EMBARQUE</th>
                                    <th class="text-center p-1">FACTURACIÓN</th>
                                    <th class="text-center p-1">TRANSPORTE</th>
                                    <th class="text-center p-1">RECOLECCIÓN</th>
                                </tr>
                            </thead>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                    <div class="planning-recolections p-0 ${viaje.tipo === "Partida" ? "d-none" : ""}">
                        <table id="recolection-table-${viaje.id_viaje}" class="table table-sm fixed-table mb-0">
                            <tbody>
                                
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>`;

            // Insertar los eventos del viaje en la tabla
            addEventTableRow(viaje.id_viaje, viaje.partidas, viaje.recolecciones);

            let tarimas = 0;
            let marcos = 0;
            let cancelados = 0;
            let recolectado = 0;

            // Obtener el total de productos del viaje
            for (const partition of viaje.partidas) {
                if (partition.planta !== "Cancelado") {
                    for (const product of partition.productos) {
                        const cantidad = product.cantidad_embarcada || 0;
                        const nombre = product.emb_orden_producto.inv_productos.nombre || '';

                        if (nombre.includes('TARIMA')) {
                            tarimas += cantidad;
                            totalTarimas += cantidad;
                        } 
                        else if (nombre.includes('MARCO')) {
                            marcos += cantidad;
                            totalMarcos += cantidad;
                        }
                    }

                } else if (partition.planta === "Cancelado") {
                    for (const product of partition.productos) {
                        const cantidad = product.cantidad_solicitada || 0;
                        cancelados += cantidad;
                        totalCancelado += cantidad;
                    }
                }
            }

            for (const recolection of viaje.recolecciones) {
                for (const product of recolection.productos) {
                    const cantidad = product.cantidad_recoleccion || 0;
                    recolectado += cantidad;
                    totalRecolecciones += cantidad;
                }
            }

            tbody.innerHTML += 
            `<tr class="p-0">
                <td colspan="3" class="p-0"></td>
                <td class="p-0">
                    <table id="trip-total-table" class="text-center table-sm mb-0 container-fluid">
                        <tbody>
                            <tr>
                                <td>Tarimas: ${tarimas.toLocaleString('en-US')}</td>
                                <td>Marcos: ${marcos.toLocaleString('en-US')}</td>
                                <td>Recolecciones: ${recolectado.toLocaleString('en-US')}</td>
                                <td>Cancelados: ${cancelados.toLocaleString('en-US')}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>`;
            };
        }

    // Agregar fila de total al inicio y al final
    thead.innerHTML =
        `<table class="text-center container-fluid">
            <tbody>
                <tr>
                    <td class="fw-bold">TOTALES</td>
                    <td><b>Tarimas: </b>${totalTarimas.toLocaleString('en-US')} pz</td>
                    <td><b>Marcos: </b>${totalMarcos.toLocaleString('en-US')} pz</td>
                    <td><b>Recolecciones: </b>${totalRecolecciones.toLocaleString('en-US')} pz</td>
                    <td><b>Cancelados: </b>${totalCancelado.toLocaleString('en-US')} pz</td>
                </tr>    
            </tbody>
        </table>`;

    tbody.innerHTML += 
        `<tr class="table-active text-center">
            <td colspan="3" class="fw-bold">TOTALES</td>
            <td>
                <table class=" container-fluid">
                    <tbody>
                        <tr>
                            <td><b>Tarimas: </b>${totalTarimas.toLocaleString('en-US')} pz</td>
                            <td><b>Marcos: </b>${totalMarcos.toLocaleString('en-US')} pz</td>
                            <td><b>Recolecciones: </b>${totalRecolecciones.toLocaleString('en-US')} pz</td>
                            <td><b>Cancelados: </b>${totalCancelado.toLocaleString('en-US')} pz</td>
                        </tr>    
                    </tbody>
                </table>
            </td>
        </tr>`;

    // Declarar el botón de exportación a Excel
    document.getElementById("report-btn").onclick = () => { planningReport(allTrips); };
}
