// Servicios Supabase
import { getPartitions, updatePartition } from '../../services/partitions-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderBillsTable } from './bills-table.js'; 
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderBillsEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-remision').value = partida.numero_remision;
    document.getElementById('edit-bill').value = partida.numero_facturacion;
    document.getElementById('edit-status').value = partida.facturacion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para validación
    const numero_facturaIn = document.getElementById('edit-bill');
    const statusIn = document.getElementById('edit-status');

    const facturaError = document.getElementById('error-editBill');
    const statusError = document.getElementById('error-editStatus');

    // Validaciones
    textValidate(numero_facturaIn, facturaError)

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
    
    if (statusIn.value === 'Pendiente') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        numero_facturacion: numero_facturaIn.value, 
        facturacion: statusIn.value 
    };

    try {
        await updatePartition(id_partida, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Estado de facturación actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(getPartitions, renderBillsTable);
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la facturación.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});