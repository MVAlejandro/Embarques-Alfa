// Servicios Supabase
import { getPartitionTrip, updatePartition } from '../../services/partitions-service.js';
import { getPartitionProducts, updateShipmentProducts } from "../../services/partition-product-service";
import { getOrderTimes } from '../../services/orders-service.js';
import { shipmentsFilter } from './shipments-filter.js';
import { validateUserRole } from '../../utils/session-validate.js';
// Utilidades
import { textValidate, inputValidate, timeValidate } from '../../utils/form-validations.js';
import { validateProductRow, viewProductRow } from '../../utils/modal-product-rows.js';
import { calculateMaxTime } from '../../utils/week-functions.js';

// Función para cargar datos en el modal
export async function renderShipmentsEditModal(partida) {
    // Obtener viaje relacionado a la partida si hay
    let viaje = {};
    if (partida.id_viaje) {
        viaje = await getPartitionTrip(partida.id_viaje);
    }

    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-id-order').value = partida.id_orden;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-time').value = partida.hora_programada;
    document.getElementById('edit-real-time').value = partida.hora_embarcada != null ? partida.hora_embarcada.slice(0, 5) : "";
    document.getElementById('edit-travel').value = partida.tiempo_traslado?.slice(0, 5) || "";
    document.getElementById('edit-receptionSt').value = partida.h_recepcion_ini;
    document.getElementById('edit-receptionEn').value = partida.h_recepcion_fin;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-status').value = partida.embarque;
    document.getElementById('edit-remision').value = partida.numero_remision;
    document.getElementById('edit-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('edit-observations').value = partida.observaciones;

    // Bloquear actualización de estado si está completado el viaje
    if (partida.embarque === "Cargado" || partida.planta !== "Terminado" || viaje.unidad === undefined) {
        document.getElementById('edit-status').disabled = true;
    } else {
        document.getElementById('edit-status').disabled = false;
    }

    // Limpiar filas anteriores
    const container1 = document.getElementById("partition-products-container");
    const container2 = document.getElementById("shipment-products-container");
    container1.innerHTML = '';
    container2.innerHTML = '';
        
    // Obtener los productos de la partida
    const productos = await getPartitionProducts(partida.id_partida);
    
    for (const producto of productos) {
        await viewProductRow("partition", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_solicitada ?? 0);
        await validateProductRow("shipment", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_embarcada ?? producto.cantidad_solicitada, producto.cantidad_orden,);
    };

    // Bloquear actualización de estado si está completado el viaje
    const productInputs = document.querySelectorAll('.product-input-quantity');

    if (partida.embarque === "Cargado" || partida.planta !== "Terminado" || viaje.unidad === undefined) {
        productInputs.forEach(input => input.disabled = true);
    } else {
        productInputs.forEach(input => input.disabled = false);
    }
    
    validateUserRole()
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('shipment-edit-form');
    // Referencias para validación
    const timeIn = document.getElementById('edit-time');
    const horaRealIn = document.getElementById('edit-real-time');
    const statusIn = document.getElementById('edit-status');
    const remisionIn = document.getElementById('edit-remision');
    const observacionesIn = document.getElementById('edit-observations');
    
    const timeError = document.getElementById('error-editTime');
    const statusError = document.getElementById('error-editStatus');
    const remisionError = document.getElementById('error-editRemision');
    const observacionesError = document.getElementById('error-editObservations');

    const times = await getOrderTimes(document.getElementById('edit-id-order').value);
    let minHour = times.h_recepcion_ini.slice(0, 5) || "00:00";
    let maxHour = calculateMaxTime(times.h_recepcion_fin, times.tiempo_traslado || "00:00");

    // Validaciones
    timeValidate(timeIn, timeError, minHour, maxHour)
    textValidate(observacionesIn, observacionesError)

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

    // Registrar la hora de embarque real
    if (statusIn.value === 'Cargado') {
        horaRealIn.value = new Date().toTimeString().slice(0, 8);
    }

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        hora_programada: timeIn.value,
        embarque: statusIn.value,
        numero_remision: remisionIn.value,
        observaciones: observacionesIn.value
    };

    // Solo agregar hora_embarcada si tiene valor
    if (horaRealIn.value) {
        updatedData.hora_embarcada = horaRealIn.value;
    }

    try {
        await updatePartition(id_partida, updatedData);
        await updateShipmentProducts(id_partida)

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Estado de embarque actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        shipmentsFilter();
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el embarque.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});