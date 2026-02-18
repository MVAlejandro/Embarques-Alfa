// Servicios Supabase
import { getPartitions, updatePartition } from '../../services/partitions-service.js'; 
import { getPartitionProducts } from '../../services/partition-product-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderProductionTable } from './production-table.js';
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';
import { viewProductRow } from '../../utils/modal-product-rows.js';

// Función para cargar datos en el modal
export async function renderProductionEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-contract').value = partida.numero_contrato;
    document.getElementById('edit-status').value = partida.planta;
    document.getElementById('edit-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('edit-observations').value = partida.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("partition-products-container");
    container.innerHTML = '';
    
    const productos = await getPartitionProducts(partida.id_partida);
    
    for (const producto of productos) {
        await viewProductRow("partition", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_solicitada ?? 0,);
    };
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const statusIn = document.getElementById('edit-status');
    const observationsIn = document.getElementById('edit-observations');

    const statusError = document.getElementById('error-editStatus');
    const observationsError = document.getElementById('error-editObservations');

    // Validaciones
    textValidate(observationsIn, observationsError)

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
        planta: statusIn.value,
        observaciones: observationsIn.value
    };

    try {
        await updatePartition(id_partida, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Estado de producción actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(getPartitions, renderProductionTable);
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la producción.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});