// Servicios Supabase
import { getUnits } from '../../services/units-service.js'
import { updatePartition } from '../../services/partitions-service.js'; 
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderTransportTable } from './transport-table.js';

// Utilidades
import { amountValidate, selectValidate, inputValidate } from '../../utils/form-validations.js';
import { loadOptions, loadOptionsFilter } from '../../utils/load-select.js';

// Función para cargar datos en el modal
export async function renderTransportEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-time').value = partida.hora_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-operator').value = partida.id_operador;
    document.getElementById('edit-status').value = partida.transporte;
    document.getElementById('edit-unit').value = partida.id_unidad;
    document.getElementById('edit-box').value = partida.id_caja;
    document.getElementById('edit-distance').value = partida.distancia;
    document.getElementById('edit-fuel').value = partida.combustible;
    document.getElementById('edit-price').value = partida.costo;
    document.getElementById('edit-tag').value = partida.tag;

    // Cargar opciones en el select
    await loadOptions('edit-operator', 'emb_operadores', 'id_operador', 'nombre', "Seleccione...", partida.id_operador);
    await loadOptionsFilter('edit-unit', getUnits, ['tipo', 'nombre'], 'id_unidad', "Seleccione...", partida.id_unidad);
    await loadOptions('edit-box', 'emb_cajas', 'id_caja', 'nombre', "Seleccione...", partida.id_caja);

    // Bloquear actualización de estado si no está facturada la partida
    const statusSelect = document.getElementById('edit-status');
    const options = statusSelect.querySelectorAll('option');

    if (partida.facturacion !== 'Documentado') {
        options.forEach((option, index) => {
            option.disabled = index > 1;
        });
    } else {
        // Si está Documentado, habilitar todo
        options.forEach(option => option.disabled = false);
    }
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

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        id_operador: operadorIn.value,
        id_unidad: unidadIn.value, 
        id_caja: cajaIn.value, 
        transporte: statusIn.value,
        distancia: distanciaIn.value,
        combustible: combustibleIn.value,
        costo: costoIn.value,
        tag: tagIn.value
    };

    try {
        await updatePartition(id_partida, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Estado de transporte actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(renderTransportTable);
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