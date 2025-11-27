// Servicios Supabase
import { updatePartition } from '../../services/partitions-service.js';
import { renderShipmentsTable } from './shipments-table.js'; 
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderShipmentsEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-time').value = partida.hora_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-status').value = partida.embarque;
    document.getElementById('edit-observations').value = partida.observaciones;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('bill-edit-form');
    // Referencias para validación
    const embarqueIn = document.getElementById('edit-status');
    const observacionesIn = document.getElementById('edit-observations');
    
    const observacionesError = document.getElementById('error-editObservations');

    // Validaciones
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Registrar la hora de embarque real
    let hora_realizada = null;
    if (embarqueIn.value == "Cargado") {
        hora_realizada = new Date().toTimeString().slice(0, 8);
    }

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        hora_realizada,
        embarque: embarqueIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updatePartition(id_partida, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Estado del embarque actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderShipmentsTable();
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        alert('Ocurrió un error al actualizar la partida.');
    }
});