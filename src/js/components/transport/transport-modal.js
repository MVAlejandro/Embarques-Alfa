// Servicios Supabase
import { getUnits } from '../../services/units-service.js'
import { updateTrip } from '../../services/trips-service.js';
import { tripsFilter } from '../../utils/planning-filters.js'; 
import { renderTransportTable } from './transport-table.js';

// Utilidades
import { amountValidate, selectValidate, inputValidate } from '../../utils/form-validations.js';
import { loadOptions, loadOptionsFilter } from '../../utils/load-select.js';

let tripType = '';

// Función para cargar datos en el modal
export async function renderTransportEditModal(viaje) {
    if (viaje.tipo == '1') {
        tripType = 'Partida';
    } else if (viaje.tipo == '2') {
        tripType = 'Recolección';
    } else if (viaje.tipo == '3') {
        tripType = 'Partida / Recolección';
    }

    // Insertar valores en los inputs
    document.getElementById('edit-id-trip').value = viaje.id_viaje;
    document.getElementById('edit-type').value = tripType;
    document.getElementById('edit-date').value = viaje.fecha_programada;
    document.getElementById('edit-time').value = viaje.hora_programada;
    document.getElementById('edit-operator').value = viaje.id_operador;
    document.getElementById('edit-status').value = viaje.estado;
    document.getElementById('edit-unit').value = viaje.id_unidad;
    document.getElementById('edit-box').value = viaje.id_caja;
    document.getElementById('edit-distance').value = viaje.distancia;
    document.getElementById('edit-fuel').value = viaje.combustible;
    document.getElementById('edit-price').value = viaje.costo;
    document.getElementById('edit-tag').value = viaje.tag;

    // Cargar opciones en el select
    await loadOptions('edit-operator', 'emb_operadores', 'id_operador', 'nombre', "Seleccione...", viaje.id_operador);
    await loadOptionsFilter('edit-unit', getUnits, ['tipo', 'nombre'], 'id_unidad', "Seleccione...", viaje.id_unidad);
    await loadOptions('edit-box', 'emb_cajas', 'id_caja', 'nombre', "Seleccione...", viaje.id_caja);
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('transport-edit-form');
    // Referencias para validación
    const operadorIn = document.getElementById('edit-operator');
    const statusIn = document.getElementById('edit-status');
    const unidadIn = document.getElementById('edit-unit');
    const cajaIn = document.getElementById('edit-box');
    const distanciaIn = document.getElementById('edit-distance');
    const combustibleIn = document.getElementById('edit-fuel');
    const costoIn = document.getElementById('edit-price');
    const tagIn = document.getElementById('edit-tag');
    
    const operadorError = document.getElementById('error-editOperator');
    const statusError = document.getElementById('error-editStatus');
    const unidadError = document.getElementById('error-editUnit');
    const cajaError = document.getElementById('error-editBox');
    const distanciaError = document.getElementById('error-editDistance');
    const combustibleError = document.getElementById('error-editFuel');
    const costoError = document.getElementById('error-editPrice');
    const tagError = document.getElementById('error-editTag');
    
    // Validaciones
    selectValidate(operadorIn, operadorError)
    selectValidate(unidadIn, unidadError)
    selectValidate(cajaIn, cajaError)
    amountValidate(distanciaIn, distanciaError)
    amountValidate(combustibleIn, combustibleError)
    amountValidate(costoIn, costoError)
    amountValidate(tagIn, tagError)
    
    const campos = document.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    } 

    if (statusIn.value === 'Planeado') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

    const id_viaje = document.getElementById('edit-id-trip').value;
    const updatedData = { 
        id_operador: operadorIn.value,
        id_unidad: unidadIn.value, 
        id_caja: cajaIn.value, 
        estado: statusIn.value,
        distancia: distanciaIn.value,
        combustible: combustibleIn.value,
        costo: costoIn.value,
        tag: tagIn.value
    };

    try {
        await updateTrip(id_viaje, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Estado del viaje actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        tripsFilter(renderTransportTable);
    } catch (err) {
        console.error('Error al actualizar viaje:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el viaje.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});