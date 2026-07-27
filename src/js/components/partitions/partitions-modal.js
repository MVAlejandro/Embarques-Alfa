// Servicios Supabase
import { getPartitions, updatePartition } from '../../services/partitions-service.js'; 
import { getPartitionProducts, updatePartitionProducts } from '../../services/partition-product-service.js';
import { getOrderTimes } from '../../services/orders-service.js';
import { getOrderProducts } from '../../services/order-product-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderPartitionsTable } from './partitions-table.js'; 
import { validateUserRole } from '../../utils/session-validate.js';
// Utilidades
import { textValidate, inputValidate, timeValidate } from '../../utils/form-validations.js';
import { validateProductRow } from '../../utils/modal-product-rows.js';
import { calculateMaxTime } from '../../utils/week-functions.js';

// Función para cargar datos en el modal
export async function renderPartitionsEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-id-order').value = partida.id_orden;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-time').value = partida.hora_programada;
    document.getElementById('edit-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-contract').value = partida.numero_contrato;
    document.getElementById('edit-observations').value = partida.observaciones;
    document.getElementById('edit-status').value = partida.planta;

    // Limpiar filas anteriores
    const container = document.getElementById("partition-products-container");
    container.innerHTML = '';
    
    // Obtener los productos de la orden
    const orderProducts = await getOrderProducts(partida.id_orden);

    // Cargar lo asignado en la partida actual para rellenar inputs
    const currentPartitionProducts = await getPartitionProducts(partida.id_partida);
    const currentProductsMap = {};

    for (const row of currentPartitionProducts) {
        currentProductsMap[row.id_orden_producto] = row.cantidad_solicitada;
    }

    // Mostrar productos en el modal
    for (const product of orderProducts) {
        const orderProductId = product.id_orden_producto;
        
        // Valor a mostrar
        const visibleQuantity = currentProductsMap[orderProductId] || 0;
        // Cantidad máxima a ingresar
        const maxValue = product.cantidad_orden

        await validateProductRow("partition", orderProductId, product.codigo, product.producto, visibleQuantity, maxValue,);
    }

    validateUserRole()
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const dateIn = document.getElementById('edit-date');
    const timeIn = document.getElementById('edit-time');
    const destinationIn = document.getElementById('edit-destination');
    const observationsIn = document.getElementById('edit-observations');
    const statusIn = document.getElementById('edit-status');

    const dateError = document.getElementById('error-editDate');
    const timeError = document.getElementById('error-editTime');
    const destinationError = document.getElementById('error-editDestination');
    const observationsError = document.getElementById('error-editObservations');
    const statusError = document.getElementById('error-editStatus');

    const times = await getOrderTimes(document.getElementById('edit-id-order').value);
    let minHour = times.h_recepcion_ini.slice(0, 5);
    let maxHour = calculateMaxTime(times.h_recepcion_fin, times.tiempo_traslado);

    // Validaciones
    textValidate(dateIn, dateError)
    timeValidate(timeIn, timeError, minHour, maxHour)
    textValidate(destinationIn, destinationError)
    textValidate(observationsIn, observationsError)

    if (statusIn.value === 'Pendiente') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

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

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        fecha_programada: dateIn.value,
        hora_programada: timeIn.value,
        destino: destinationIn.value,
        observaciones: observationsIn.value,
        planta: statusIn.value
    };

    if (statusIn.value === 'Cancelado') {
        updatedData.facturacion = 'Cancelado';
        updatedData.embarque = 'Cancelado';
        updatedData.transporte = 'Cancelado';
    }

    if (statusIn.value === 'Proyectado') {
        updatedData.embarque = 'Proyectado';
    }

    try {
        await updatePartition(id_partida, updatedData);
        await updatePartitionProducts(id_partida);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Partida actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(getPartitions, renderPartitionsTable);
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la partida.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});