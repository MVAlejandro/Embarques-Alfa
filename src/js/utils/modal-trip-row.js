// Utilidades
import { inputValidate } from "./form-validations";

// Función para agregar campos de productos con input y validación de cantidad
export async function addEventRow(partitionsEl, recolectionsEl) {
    const container1 = document.getElementById("partition-container");
    const container2 = document.getElementById("recolection-container");
    // Cargar los eventos asignados para rellenar listado
    const partitions = partitionsEl;
    const recolections = recolectionsEl;
    
    container1.innerHTML = `<p class="ms-3 p-2 ps-1 fw-bold">Partidas asignadas</p>`;
    // Agregar una fila por cada producto
    for (const partition of partitions) {
        const index = container1.children.length;
        // Colocar id único
        const uniqueId = `partition-${index}`;

        const newPartition = document.createElement("div");
        newPartition.className = `row d-flex align-items-center ms-2 me-2 pt-2 pb-2 partitionEvent-item`;
        newPartition.dataset.idPartition = partition.id_partida;
        newPartition.innerHTML =
            `<div class="col-8">
                <p class="trip-text fst-italic">${partition.cliente}</p>
                <ul class="ms-2">
                    <li class="trip-text">
                        <b>Destino: </b>${partition.ubicacion} - <b>Cantidad: </b>${partition.productos.reduce((total, p) => total + (p.cantidad_solicitada ?? 0), 0)} Unidades 
                    </li>
                </ul>
            </div>
            <div class="col-4 label-over-border">
                <label for="${uniqueId}-status" class="form-label m-2">Estado</label>
                <select id="${uniqueId}-status" class="form-select" aria-label="Default select example">  
                    <option value="Planeado">Seleccione...</option>
                    <option value="Asignado">Asignado</option>
                    <option value="En ruta">En ruta</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Rechazo parcial">Rechazo parcial</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <p class="error invalid-feedback" id="error-${uniqueId}" style="color: red;"></p>
            </div>
            `;

        const select = newPartition.querySelector('select');
        select.value = partition.transporte;
        container1.appendChild(newPartition);
    }
    
    container2.innerHTML = `<p class="ms-3 p-2 ps-1 fw-bold">Recolecciones asignadas</p>`;
    // Agregar una fila por cada producto
    for (const recolection of recolections) {
        const index = container2.children.length;
        // Colocar id único
        const uniqueId = `recolection-${index}`;

        const newRecolection = document.createElement("div");
        newRecolection.className = `row d-flex align-items-center ms-2 me-2 pt-2 pb-2 recolectionEvent-item`;
        newRecolection.dataset.idRecolection = recolection.id_recoleccion;
        newRecolection.innerHTML =
            `<div class="col-8">
                <p class="trip-text fst-italic">${recolection.proveedor}</p>
                <ul class="ms-2">
                    <li class="trip-text">
                        <b>Destino: </b>${recolection.ubicacion} - <b>Cantidad: </b>${recolection.productos.reduce((total, r) => total + (r.cantidad_recoleccion ?? 0), 0)} Unidades 
                    </li>
                </ul>
            </div>
            <div class="col-4 label-over-border">
                <label for="${uniqueId}-status" class="form-label m-2">Estado</label>
                <select id="${uniqueId}-status" class="form-select" aria-label="Default select example"> 
                    <option value="Planeado">Seleccione...</option>
                    <option value="Asignado">Asignado</option>
                    <option value="En ruta">En ruta</option>
                    <option value="Recolectado">Recolectado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
                <p class="error invalid-feedback" id="error-${uniqueId}" style="color: red;"></p>
            </div>
            `;

        const select = newRecolection.querySelector('select');
        select.value = recolection.transporte;
        container2.appendChild(newRecolection);
    }
}

export async function validateEvents() {
    let hasInvalidSelect = false;
    
    // Limpieza previa
    document.querySelectorAll('.partitionEvent-item select, .recolectionEvent-item select').forEach(select => {
        select.classList.remove('is-invalid');
    });
    
    // Validación
    document.querySelectorAll('.partitionEvent-item select, .recolectionEvent-item select').forEach(select => {
        if (select.value === 'Planeado') {
            select.classList.add('is-invalid');
            hasInvalidSelect = true;
        }
    });
    
    if (hasInvalidSelect) {
        Swal.fire({
            title: 'Atención',
            text: 'Se debe seleccionar una opción válida en todos los registros.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }
}
