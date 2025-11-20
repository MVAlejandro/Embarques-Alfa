// Servicios Supabase
import { updateOrder } from '../../services/orders-service.js';
import { renderTransportTable } from './transport-table.js';

// Utilidades
import { selectValidate, inputValidate } from '../../utils/form-validations.js';
import { loadOptions } from '../../utils/load-select.js';

// Función para cargar datos en el modal
export async function renderTransportEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-order').value = orden.id_orden;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-date').value = orden.fecha;
    document.getElementById('edit-unit').value = orden.id_unidad;
    document.getElementById('edit-box').value = orden.id_caja;

    // Cargar opciones en el select
    await loadOptions('edit-unit', 'emb_unidades', 'id_unidad', 'nombre', "Seleccione...", orden.id_unidad);
    await loadOptions('edit-box', 'emb_cajas', 'id_caja', 'nombre', "Seleccione...", orden.id_caja);
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('transport-edit-form');
    // Referencias para validación
    const unidadIn = document.getElementById('edit-unit');
    const cajaIn = document.getElementById('edit-box');
    
    const unidadError = document.getElementById('error-editUnit');
    const cajaError = document.getElementById('error-editBox');
    
    // Validaciones
    selectValidate(unidadIn, unidadError)
    selectValidate(cajaIn, cajaError)
    
    const campos = document.querySelectorAll('select')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }
    
    let transporte = "Sin Asignar"

    if (unidadIn.value !== '0' && cajaIn.value !== '0') {
        transporte = "Asignado"
    } 

    const id_orden = document.getElementById('edit-id-order').value;
    const updatedData = { 
        id_unidad: unidadIn.value, 
        id_caja: cajaIn.value, 
        transporte 
    };

    try {
        await updateOrder(id_orden, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Unidad actualizada correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderTransportTable();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        alert('Ocurrió un error al actualizar la orden de compra.');
    }
});