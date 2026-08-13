// Servicios Supabase
import { getTrips, updateTrip } from '../../services/trips-service.js';
import { updatePartition } from '../../services/partitions-service.js';
import { updateRecolection } from '../../services/recolections-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderTripsTable } from './trips-table.js'; 

// Utilidades
import { amountValidate, inputValidate } from '../../utils/form-validations.js';
import { addEventRow } from '../../utils/trip-modal-row.js';

// Función para cargar datos en el modal
export async function renderTripEditModal(viaje) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-trip').value = viaje.id_viaje;
    document.getElementById('edit-trip-type').value = viaje.tipo;
    document.getElementById('edit-trip-date').value = viaje.fecha_programada;
    document.getElementById('edit-trip-time').value = viaje.hora_programada;
    document.getElementById('edit-real-time').value = viaje.hora_salida != null ? viaje.hora_salida.slice(0, 5) : "";
    document.getElementById('edit-operator').value = viaje.operador;
    document.getElementById('edit-unit').value = viaje.unidad;
    document.getElementById('edit-box').value = viaje.caja;
    document.getElementById('edit-distance').value = viaje.distancia;
    document.getElementById('edit-fuel').value = viaje.combustible;
    document.getElementById('edit-price').value = viaje.costo;
    document.getElementById('edit-tag').value = viaje.tag;
    document.getElementById('edit-status').value = viaje.estado;
    document.getElementById('edit-observations').value = viaje.observaciones;

    // Bloquear actualización de estado si está completado el viaje
    if (viaje.estado == "Completado") {
        document.getElementById('edit-status').disabled = true;
    } else {
        document.getElementById('edit-status').disabled = false;
    }

    // Limpiar filas anteriores
    const container1 = document.getElementById("partition-container");
    const container2 = document.getElementById("recolection-container");
    container1.innerHTML = '';
    container1.classList.remove("d-none");
    container2.innerHTML = '';
    container2.classList.remove("d-none");

    await addEventRow(viaje.partidas, viaje.recolecciones);

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
    const horaRealIn = document.getElementById('edit-real-time');
    const distanciaIn = document.getElementById('edit-distance');
    const combustibleIn = document.getElementById('edit-fuel');
    const costoIn = document.getElementById('edit-price');
    const tagIn = document.getElementById('edit-tag');
    const statusIn = document.getElementById('edit-status');
    const observacionesIn = document.getElementById('edit-observations');
    
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

    // Registrar la hora de salida real
    if (statusIn.value === 'En ruta') {
        horaRealIn.value = new Date().toTimeString().slice(0, 8);
    }

    const id_viaje = document.getElementById('edit-id-trip').value;
    const tipo = document.getElementById('edit-trip-type').value;
    const updatedData = { 
        distancia: distanciaIn.value,
        combustible: combustibleIn.value,
        costo: costoIn.value,
        tag: tagIn.value,
        estado: statusIn.value,
        observaciones: observacionesIn.value
    };

    // Solo agregar hora_salida si tiene valor
    if (horaRealIn.value) {
        updatedData.hora_salida = horaRealIn.value;
    }

    try {
        // Validar selecciones de cada estado de evento
        let hasInvalidSelect = false;

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

        // Actualizar el viaje
        await updateTrip(id_viaje, updatedData);
        
        // Armar los arreglos de partidas y recolecciones para actualizar
        const partitionsData = Array.from(document.querySelectorAll('.partitionEvent-item')).map(row => ({
            id_partida: row.dataset.idPartition,
            transporte: row.querySelector('select').value
        }));

        const recolectionsData = Array.from(document.querySelectorAll('.recolectionEvent-item')).map(row => ({
            id_recoleccion: row.dataset.idRecolection,
            transporte: row.querySelector('select').value
        }));

        const hora_recolectada = new Date().toTimeString().slice(0, 8);
        const hora_entregada = new Date().toTimeString().slice(0, 8);
        // Detectar qué tipo de viaje se está editando
        if (tipo === "Partida") {
            // Solo actualizar partidas
            partitionsData.forEach(p => {
                if (p.transporte === 'Entregado') {
                    p.hora_entregada = hora_entregada;
                }
                updatePartition(p.id_partida, p);
            });
        } else if (tipo === "Recolección") {
            // Solo actualizar recolecciones
            recolectionsData.forEach(r => {
                if (r.transporte === 'Recolectado') {
                    r.hora_recolectada = hora_recolectada;
                }
                updateRecolection(r.id_recoleccion, r);
            });
        } else {
            // Actualizar ambas
            partitionsData.forEach(p => {
                if (p.transporte === 'Entregado') {
                    p.hora_entregada = hora_entregada;
                }
                updatePartition(p.id_partida, p);
            });
            recolectionsData.forEach(r => {
                if (r.transporte === 'Recolectado') {
                    r.hora_recolectada = hora_recolectada;
                }
                updateRecolection(r.id_recoleccion, r);
            });
        }

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