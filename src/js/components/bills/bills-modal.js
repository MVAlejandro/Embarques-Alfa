// Servicios Supabase
import { updatePartition } from '../../services/partitions-service.js';
import { renderBillsTable } from './bills-table.js'; 

// Función para cargar datos en el modal
export async function renderBillsEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-status').value = partida.facturacion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const facturacion = document.getElementById('edit-status').value;
    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { facturacion };

    try {
        await updatePartition(id_partida, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Estado de facturación actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderBillsTable();
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        alert('Ocurrió un error al actualizar la partida.');
    }
});