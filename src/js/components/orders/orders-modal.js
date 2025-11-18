import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateOrder, deleteOrder } from '../../services/orders-service.js';
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { textValidate, amountValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderOrdersEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-order').value = orden.id_orden;
    document.getElementById('edit-client').value = orden.cliente;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-contract').value = orden.numero_contrato;
    document.getElementById('edit-date').value = orden.fecha;
    document.getElementById('edit-observations').value = orden.observaciones;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para validación
    const id_clienteIn = document.getElementById('edit-client');
    const numero_ordenIn = document.getElementById('edit-oc');
    const numero_contratoIn = document.getElementById('edit-contract');
    const fechaIn = document.getElementById('edit-date');
    const observacionesIn = document.getElementById('edit-observations');

    const id_clienteError = document.getElementById('error-editClient');
    const numero_ordenError = document.getElementById('error-editOc');
    const numero_contratoError = document.getElementById('error-editContract');
    const fechaError = document.getElementById('error-editDate');
    const observacionesError = document.getElementById('error-editObservations');

    // Validaciones
    selectValidate(id_clienteIn, id_clienteError)
    amountValidate(numero_ordenIn, numero_ordenError)
    amountValidate(numero_contratoIn, numero_contratoError)
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input', 'select')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_orden = document.getElementById('edit-id-order').value;
    const updatedData = {
        id_cliente: id_clienteIn.value,
        numero_orden: numero_ordenIn.value,
        numero_contrato: numero_contratoIn.value,
        fecha: fechaIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updateOrder(id_orden, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Orden de compra actualizada correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderOrdersTable();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        alert('Ocurrió un error al actualizar la ordend e compra.');
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idOrder = document.getElementById('delete-id-order').value;
    await deleteOrder(idOrder);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Orden de compra eliminada correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderOrdersTable();
});