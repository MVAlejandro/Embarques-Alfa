import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateOrder, deleteOrder } from '../../services/order-service.js';
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';
import { textValidate, amountValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderOrdersEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-orden').value = orden.id_orden;
    document.getElementById('edit-cliente').value = orden.cliente;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-contrato').value = orden.numero_contrato;
    document.getElementById('edit-fecha').value = orden.fecha;
    document.getElementById('edit-observaciones').value = orden.observaciones;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para validación
    const id_clienteIn = document.getElementById('edit-cliente');
    const numero_ordenIn = document.getElementById('edit-oc');
    const numero_contratoIn = document.getElementById('edit-contrato');
    const fechaIn = document.getElementById('edit-fecha');
    const observacionesIn = document.getElementById('edit-observaciones');

    const id_clienteError = document.getElementById('error-editCliente');
    const numero_ordenError = document.getElementById('error-editOc');
    const numero_contratoError = document.getElementById('error-editContrato');
    const fechaError = document.getElementById('error-editContrato');
    const observacionesError = document.getElementById('error-editObservaciones');

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

    const id_orden = document.getElementById('edit-id-orden').value;
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
    const idOrder = document.getElementById('delete-id-orden').value;
    await deleteOrder(idOrder);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Orden de compra eliminada correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderOrdersTable();
});