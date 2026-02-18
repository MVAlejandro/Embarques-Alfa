
const statusColorMap = {
    // Azul
    "Planeado": "blue", "En secado": "blue",
    // Amarillo
    "Pendiente": "yellow", "En proceso": "yellow", "Preparando": "yellow", "En ruta": "yellow",
    // Verde claro
    "PT parcial": "greenL", "En carga": "greenL", "Asignado": "greenL",
    // Verde oscuro
    "Terminado": "greenD", "Cargado": "greenD", "Entregado": "greenD", "Documentado": "greenD", "Recolectado": "greenD",
    // Rojo
    "Cancelado": "red", "Rechazado": "red", "Rechazo parcial": "red",
    // Gris
    "Reprogramado": "grey"
};

function getColor(status) {
    return statusColorMap[status];
}

// Función para agregar campos de productos con input y validación de cantidad
export function addEventTableRow(id, partitions, recolections) {
    // Cargar los eventos asignados para rellenar listado
    const tbody1 = document.querySelector(`#partition-table-${id} tbody`);
    const tbody2 = document.querySelector(`#recolection-table-${id} tbody`);

    if (!tbody1 || !tbody2) return;

    // Limpiar elementos antes de insertar
    tbody1.innerHTML = '';
    tbody1.classList.remove("d-none");
    tbody2.innerHTML = '';
    tbody2.classList.remove("d-none");
    
    if (!partitions || partitions.length === 0) {
        tbody1.innerHTML = `<tr><td class="text-center" colspan="7">No hay partidas asociadas</td></tr>`;
    } else {
        // Agregar una fila por cada partida
        for (const partition of partitions) {
            const plantaClass = getColor(partition.planta);
            const transporteClass = getColor(partition.transporte);
            const embarqueClass = getColor(partition.embarque);
            const facturacionClass = getColor(partition.facturacion);

            const newPartition = document.createElement("tr");
            newPartition.dataset.idPartition = partition.id_partida;
            newPartition.innerHTML =
                `<td class="partition-time text-center p-2">
                    ${partition.planta === "Cancelado" ? "Cancelado" : `${partition.hora_programada?.slice(0, 5)} - ${partition.hora_embarcada ? partition.hora_embarcada.slice(0, 5) : "Pendiente"}`}
                </td>
                <td class="partition-client p-2">${partition.cliente}</td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status ${plantaClass}"
                        data-bs-target="#production-modal" 
                        data-bs-toggle="modal">
                            ${partition.planta}
                    </button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status ${embarqueClass}"
                        data-bs-target="#shipment-modal" 
                        data-bs-toggle="modal">
                            ${partition.embarque}
                    </button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status ${facturacionClass}"
                        data-bs-target="#bill-modal" 
                        data-bs-toggle="modal">
                            ${partition.facturacion}
                    </button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status ${transporteClass}"
                        data-bs-target="#transport-modal" 
                        data-bs-toggle="modal">
                            ${partition.transporte}
                    </button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status grey disabled">
                            N/A
                    </button>
                </td>
                `;

            tbody1.appendChild(newPartition);
        }
    }

    if (!recolections || recolections.length === 0) {
        tbody2.innerHTML = `<tr><td class="text-center" colspan="7">No hay recolecciones asociadas</td></tr>`;
    } else {
        // Agregar una fila por cada recolección
        for (const recolection of recolections) {
            const recoleccionClass = getColor(recolection.transporte);

            const newRecolection = document.createElement("tr");
            newRecolection.dataset.idRecolection = recolection.id_recoleccion;
            newRecolection.innerHTML =
                `<td class="recolection-time text-center p-2">
                    ${recolection.transporte === "Cancelado" ? "Cancelado" : `${recolection.hora_programada?.slice(0, 5)} - ${recolection.hora_recolectada ? recolection.hora_recolectada.slice(0, 5) : "Pendiente"}`}
                </td>
                <td class="recolection-supplier p-2">${recolection.proveedor}</td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status grey disabled">N/A</button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status grey disabled">N/A</button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status grey disabled">N/A</button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status grey disabled">N/A</button>
                </td>
                <td class="text-center p-2">
                    <button class="btn-primary planning-status ${recoleccionClass}"
                        data-bs-target="#recolection-modal" 
                        data-bs-toggle="modal">
                            ${recolection.transporte}
                    </button>
                </td>
                `;

            tbody2.appendChild(newRecolection);
        }
    }
}
