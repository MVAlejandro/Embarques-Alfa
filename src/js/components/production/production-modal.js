// Servicios Supabase
import { updateOrder } from '../../services/orders-service.js';
import { renderProductionTable } from './production-table.js'; 

// Función para cargar datos en el modal
export async function renderProductionEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-order').value = orden.id_orden;
    document.getElementById('edit-date').value = orden.fecha;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-status').value = orden.planta;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para validación
    const planta = document.getElementById('edit-status').value;
    const id_orden = document.getElementById('edit-id-order').value;
    const updatedData = {
        planta
    };

    try {
        await updateOrder(id_orden, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Estado de producción actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderProductionTable();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        alert('Ocurrió un error al actualizar la orden de compra.');
    }
});