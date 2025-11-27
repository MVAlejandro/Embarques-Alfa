// Servicios Supabase
import { updatePartition } from '../../services/partitions-service.js'; 
import { renderTransportTable } from './transport-table.js';

// Utilidades
import { selectValidate, inputValidate } from '../../utils/form-validations.js';
import { loadOptions } from '../../utils/load-select.js';

// Función para cargar datos en el modal
export async function renderTransportEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-time').value = partida.hora_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-status').value = partida.transporte;
    document.getElementById('edit-unit').value = partida.id_unidad;
    document.getElementById('edit-box').value = partida.id_caja;

    // Cargar opciones en el select
    await loadOptions('edit-unit', 'emb_unidades', 'id_unidad', 'nombre', "Seleccione...", partida.id_unidad);
    await loadOptions('edit-box', 'emb_cajas', 'id_caja', 'nombre', "Seleccione...", partida.id_caja);
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('transport-edit-form');
    // Referencias para validación
    const transporteIn = document.getElementById('edit-status');
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

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        id_unidad: unidadIn.value, 
        id_caja: cajaIn.value, 
        transporte: transporteIn.value
    };

    try {
        await updatePartition(id_partida, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Unidad actualizada correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderTransportTable();
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        alert('Ocurrió un error al actualizar la partida.');
    }
});