// Servicios Supabase
import { updateOrder } from '../../services/orders-service.js';
import { renderShipmentsTable } from './shipments-table.js'; 
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderShipmentsEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-order').value = orden.id_orden;
    document.getElementById('edit-date').value = orden.fecha;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-status').value = orden.embarque;
    document.getElementById('edit-observations').value = orden.observaciones;
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

    const id_orden = document.getElementById('edit-id-order').value;
    const updatedData = { 
        embarque: embarqueIn.value, 
        observaciones: observacionesIn.value
    };

    try {
        await updateOrder(id_orden, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Estado del embarque actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderShipmentsTable();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        alert('Ocurrió un error al actualizar la orden de compra.');
    }
});