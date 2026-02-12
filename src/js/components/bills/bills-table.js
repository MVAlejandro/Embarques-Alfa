// Servicios Supabase
import { getPartitions } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js';
import { validateUserRole } from '../../utils/session-validate.js';

let allPartitions = [];

// Función para crear la tabla y la paginación
export async function renderBillsTable(partitionsParam = null) {
    // Obtener partidas si no se pasa una lista filtrada
    if (partitionsParam) {
        allPartitions = partitionsParam;
    } else {
        allPartitions = await getPartitions();
    }
    
    const tbody = document.querySelector('#bills-table tbody');
    const weekText = document.getElementById('weekHeader');
    // Limpiar elementos antes de insertar
    weekText.innerHTML = "Semana 0";
    tbody.innerHTML = '';

    if (!allPartitions || allPartitions.length === 0) {
        tbody.innerHTML = `<tr><td class="text-center" colspan="8">No hay partidas registradas</td></tr>`;
        return;
    }

    let totalGeneral = 0;
    let totalCancelado = 0;

    weekText.innerHTML = `Semana ${allPartitions[0].semana}`;
    
    for (const partida of allPartitions) {
        // Determinar clase CSS para el estatus de embarque
        let shipmentStatusClass = '';
        if (partida.embarque == 'En preparación') {
            shipmentStatusClass = 'yellow';
        } else if (partida.embarque == 'Proceso de carga') {
            shipmentStatusClass = 'greenL';
        } else if (partida.embarque == 'Cargado') {
            shipmentStatusClass = 'greenD';
        } else if (partida.embarque == 'Cancelado') {
            shipmentStatusClass = 'red';
        } else {
            shipmentStatusClass = 'blue';
        }

        // Determinar clase CSS para el estatus de facturación
        let BillStatusClass = '';
        if (partida.facturacion == 'Documentado') {
            BillStatusClass = 'greenD';
        } else if (partida.facturacion == 'Cancelado') {
            BillStatusClass = 'red';
        } else {
            BillStatusClass = 'yellow';
        }

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);

        // Calcular total de cantidades
        if (partida.planta !== "Cancelado") {
            const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            totalGeneral += totalAmount;
        } else if (partida.planta === "Cancelado") {
            const totalAmount = productos.reduce((acc, prod) => acc + (prod.cantidad_solicitada || 0), 0);
            totalCancelado += totalAmount;
        }

        tbody.innerHTML += 
        `<tr>
            <td class="bill-date fw-bold p-2 ps-4">${partida.fecha_programada}</td>
            <td class="p-2">
                <p class="bill-oc fw-bold">OC-${partida.numero_orden}</p>
                <p class="bill-contract">Contrato #${partida.numero_contrato}</p>
            </td>
            <td class="bill-client p-2">${partida.cliente}</td>
            <td id="bill-products-${partida.id_partida}" class="p-2">
                
            </td>
            <td class="text-center p-2">
                <p class="bill-status ${shipmentStatusClass}">${partida.embarque}</p>
            </td>
            <td class="text-center p-2">
                <p class="bill-status ${BillStatusClass}">${partida.facturacion}</p>
            </td>
            <td class="bill-number p-2">${partida.numero_facturacion || "Sin Registro"}</td>
            <td class="bill-control text-center d-none" data-vent-only>
                <button class="btn btn-primary btn-update" 
                    data-bs-target="#edit-modal" 
                    data-bs-toggle="modal"
                    ${partida.facturacion === "Documentado" || partida.embarque !== "Cargado" || partida.planta === "Cancelado" ? "disabled" : ""}
                    partition-data='${JSON.stringify(partida)}'>
                    ${partida.facturacion === "Documentado" ? "Completado" : partida.facturacion === "Cancelado" ? "Cancelado" : "Actualizar"}
                </button>
            </td>
        </tr>`;

        // Insertar productos de esta partida
        const container = document.getElementById(`bill-products-${partida.id_partida}`);
        container.innerHTML = '';

        for (const producto of productos) {
            container.innerHTML += 
            `<p class="bill-product">${producto.codigo} - <b> Cant. ${(producto.cantidad_solicitada ?? 0).toLocaleString('en-US')}</b></p>
            <p class="bill-cant">${producto.producto}</p>
            <hr>`;
        };
    };

    // Agregar fila de total al final
    tbody.innerHTML += 
    `<tr class="table-active">
        <td></td>
        <td colspan="6">
            <table class="text-center container-fluid">
                <tbody>
                    <tr>
                        <td class="fw-bold">TOTALES</td>
                        <td><b>Solicitado: </b>${totalGeneral.toLocaleString('en-US')} pz</td>
                        <td><b>Cancelado: </b>${totalCancelado.toLocaleString('en-US')} pz</td>
                    </tr>    
                </tbody>
            </table>
        </td>
        <td></td>
    </tr>`;

    validateUserRole()
}
