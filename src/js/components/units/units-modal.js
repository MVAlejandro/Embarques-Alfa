import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateUnit, updateBox, deleteUnit, deleteBox } from '../../services/units-service.js';
import { renderUnitsTable } from './units-table.js';
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderUnitsEditModal(unidad) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-unit').value = unidad.id_unidad || unidad.id_caja;
    document.getElementById('edit-name').value = unidad.nombre;
    document.getElementById('edit-type').value = unidad.tipo;
    document.getElementById('edit-license').value = unidad.placas;
    document.getElementById('edit-policy').value = unidad.numero_poliza;
    document.getElementById('edit-description').value = unidad.descripcion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('unit-edit-form');
    // Referencias para validación
    const nombreIn = document.getElementById('edit-name');
    const placasIn = document.getElementById('edit-license');
    const polizaIn = document.getElementById('edit-policy');
    const descripcionIn = document.getElementById('edit-description');

    const nombreError = document.getElementById('error-editName');
    const placasError = document.getElementById('error-editLicense');
    const polizaError = document.getElementById('error-editPolicy');
    const descripcionError = document.getElementById('error-editDescription');

    // Validaciones
    textValidate(nombreIn, nombreError)
    textValidate(placasIn, placasError)
    textValidate(polizaIn, polizaError)
    textValidate(descripcionIn, descripcionError)

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

    const id_unidad = document.getElementById('edit-id-unit').value;
    const tipo = document.getElementById('edit-type').value;
    const updatedData = {
        nombre: nombreIn.value,
        placas: placasIn.value,
        numero_poliza: polizaIn.value,
        descripcion: descripcionIn.value
    };

    try {
        if (tipo === 'Caja') {
            await updateBox(id_unidad, updatedData);
        } else {
            await updateUnit(id_unidad, updatedData);
        }

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Unidad actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderUnitsTable();
    } catch (err) {
        console.error('Error al actualizar unidad:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la unidad.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
