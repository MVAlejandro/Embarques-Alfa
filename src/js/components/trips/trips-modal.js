// Servicios Supabase
import { getTrips, updateTrip } from '../../services/trips-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderTripsTable } from './trips-table.js'; 

// Utilidades
import { amountValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderTripEditModal(viaje) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-trip').value = viaje.id_viaje;
    document.getElementById('edit-trip-date').value = viaje.fecha_programada;
    document.getElementById('edit-trip-time').value = viaje.hora_programada;
    document.getElementById('edit-operator').value = viaje.operador;
    document.getElementById('edit-unit').value = viaje.unidad;
    document.getElementById('edit-box').value = viaje.caja;
    document.getElementById('edit-distance').value = viaje.distancia;
    document.getElementById('edit-fuel').value = viaje.combustible;
    document.getElementById('edit-price').value = viaje.costo;
    document.getElementById('edit-tag').value = viaje.tag;
    document.getElementById('edit-status').value = viaje.estado;

    // Limpiar filas anteriores
    const container1 = document.getElementById("partition-container");
    const container2 = document.getElementById("recolection-container");
    container1.innerHTML = '';
    container1.classList.remove("d-none");
    container2.innerHTML = '';
    container2.classList.remove("d-none");

    // Cargar los eventos asignados para rellenar listado
    const partitions = viaje.partidas;
    const recolections = viaje.recolecciones;
    
    container1.innerHTML = `<p class="ms-3 p-2 ps-1 fw-bold">Partidas asignadas</p>`;
    // Agregar una fila por cada producto
    for (const partition of partitions) {
        const newPartition = document.createElement("div");
        newPartition.innerHTML =
            `<ul class="ms-3">
                <li class="trip-text">
                    <b>Cliente: </b>${partition.cliente} - <b>Destino: </b>${partition.ubicacion} - <b>Cantidad: </b>${partition.productos.reduce((total, p) => total + (p.cantidad_solicitada ?? 0), 0)} Unidades 
                </li>
            </ul>`;

        container1.appendChild(newPartition);
    }
    
    container2.innerHTML = `<p class="ms-3 p-2 ps-1 fw-bold">Recolecciones asignadas</p>`;
    // Agregar una fila por cada producto
    for (const recolection of recolections) {
        const newRecolection = document.createElement("div");
        newRecolection.innerHTML =
            `<ul class="ms-3">
                <li class="trip-text">
                    <b>Proveedor: </b>${recolection.proveedor} - <b>Destino: </b>${recolection.ubicacion} - <b>Cantidad: </b>${recolection.productos.reduce((total, p) => total + (p.cantidad_recoleccion ?? 0), 0)} Unidades 
                </li>
            </ul>`;

        container2.appendChild(newRecolection);
    }

    if (viaje.tipo === "Partida") {
       container2.classList.add("d-none");
    } else if (viaje.tipo === "Recolección") {
        container1.classList.add("d-none");
    }
}

// Función para guardar cambios
document.getElementById('btn-edit-trip').addEventListener('click', async function() {
    const form = document.getElementById('trip-edit-form');
    // Referencias para validación
    const distanciaIn = document.getElementById('edit-distance');
    const combustibleIn = document.getElementById('edit-fuel');
    const costoIn = document.getElementById('edit-price');
    const tagIn = document.getElementById('edit-tag');
    const statusIn = document.getElementById('edit-status');
    
    const distanciaError = document.getElementById('error-editDistance');
    const combustibleError = document.getElementById('error-editFuel');
    const costoError = document.getElementById('error-editPrice');
    const tagError = document.getElementById('error-editTag');
    const statusError = document.getElementById('error-editStatus');
    
    // Validaciones
    amountValidate(distanciaIn, distanciaError)
    amountValidate(combustibleIn, combustibleError)
    amountValidate(costoIn, costoError)
    amountValidate(tagIn, tagError)
    
    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    } 

    if (statusIn.value === 'Planeado') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

    const id_viaje = document.getElementById('edit-id-trip').value;
    const updatedData = { 
        distancia: distanciaIn.value,
        combustible: combustibleIn.value,
        costo: costoIn.value,
        tag: tagIn.value,
        estado: statusIn.value
    };

    try {
        await updateTrip(id_viaje, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('trip-modal')).hide();
        Swal.fire({
            title: 'Estado del viaje actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(getTrips, renderTripsTable);
    } catch (err) {
        console.error('Error al actualizar viaje:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el viaje.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});