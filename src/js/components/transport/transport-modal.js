// Servicios Supabase
import { updatePartition, getPartitions } from '../../services/partitions-service.js';
import { getPartitionProducts } from '../../services/partition-product-service.js';
import { updateRecolection, getRecolections } from '../../services/recolections-service.js'; 
import { getRecolectionProducts } from '../../services/recolection-product-service.js';
import { getTrips } from '../../services/trips-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderPartitionTransportTable, renderRecolectionTransportTable } from './transport-table.js';
import { renderTripsTable } from '../trips/trips-table.js';

// Utilidades
import { selectValidate, inputValidate } from '../../utils/form-validations.js';
import { loadTripsFilter } from '../../utils/load-select.js';
import { viewProductRow } from '../../utils/modal-product-rows.js';

// Función para cargar datos en el modal
export async function renderTransportAsignModal(registro) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-register').value = registro.id_partida || registro.id_recoleccion;
    document.getElementById('edit-date').value = registro.fecha_programada;
    document.getElementById('edit-time').value = registro.hora_programada;
    document.getElementById('edit-client').value = registro.cliente || registro.proveedor;
    document.getElementById('edit-destination').value = registro.destino;
    document.getElementById('edit-trip').value = registro.id_viaje;
    
    // Limpiar filas anteriores
    const container1 = document.getElementById("partition-products-container");
    const container2 = document.getElementById("recolection-products-container");
    container1.innerHTML = '';
    container2.innerHTML = '';

    if (registro.id_partida) {
        // Cargar opciones en el select
        await loadTripsFilter('Partida', registro.fecha_programada, ['hora_programada', 'unidad'], registro.id_viaje);

        // Cargar lo asignado en la partida para rellenar inputs
        const productos = await getPartitionProducts(registro.id_partida);

        // Agregar una fila por cada producto
        for (const product of productos) {
            await viewProductRow("partition", product.id_orden_producto, product.codigo, product.producto, product.cantidad_solicitada ?? 0,);
        }

        document.getElementById('edit-type').value = "partida";
    } else if (registro.id_recoleccion) {
        // Cargar opciones en el select
        await loadTripsFilter('Recolección', registro.fecha_programada, ['hora_programada', 'unidad'], registro.id_viaje);

        // Cargar lo asignado en la recolección para rellenar inputs
        const productos = await getRecolectionProducts(registro.id_recoleccion);
            
        // Agregar una fila por cada producto
        for (const product of productos) {
            await viewProductRow("recolection", product.id_producto, product.codigo, product.producto, product.cantidad_recoleccion ?? 0,);
        }

        document.getElementById('edit-type').value = "recoleccion";
    }
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('transport-edit-form');
    // Referencias para validación
    const viajeIn = document.getElementById('edit-trip');
    
    const viajeError = document.getElementById('error-editTrip');
    
    // Validaciones
    selectValidate(viajeIn, viajeError)
    
    const campos = document.querySelectorAll('select')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    } 

    const id_registro = document.getElementById('edit-id-register').value;
    const tipo = document.getElementById('edit-type').value;
    const updatedData = { id_viaje: viajeIn.value };

    if (tipo == "partida") {
        try {
            await updatePartition(id_registro, updatedData);

            // Cerrar el modal y mostrar alerta
            bootstrap.Modal.getInstance(document.getElementById('asign-modal')).hide();
            Swal.fire({
                title: 'Viaje asignado correctamente.',
                text: 'Partida asignada al viaje.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (err) {
            console.error('Error al actualizar partida:', err);
            Swal.fire({
                title: 'Oops...',
                text: 'Ocurrió un error al asignar la partida.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } else if (tipo == "recoleccion") {
        try {
            await updateRecolection(id_registro, updatedData);

            // Cerrar el modal y mostrar alerta
            bootstrap.Modal.getInstance(document.getElementById('asign-modal')).hide();
            Swal.fire({
                title: 'Viaje asignado correctamente.',
                text: 'Recolección asignada al viaje.',
                icon: 'success',
                confirmButtonText: 'OK'
            });

        } catch (err) {
            console.error('Error al actualizar recolección:', err);
            Swal.fire({
                title: 'Oops...',
                text: 'Ocurrió un error al asignar la recolección.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    // Recarga la tabla con los datos actualizados
    planningFilter(getPartitions, renderPartitionTransportTable)
    planningFilter(getRecolections, renderRecolectionTransportTable)
    planningFilter(getTrips, renderTripsTable);
});