import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateUnit, deleteUnit } from '../../services/units-service.js';
import { renderUnitsTable } from './units-table.js';
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderUnitsEditModal(unidad) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-unit').value = unidad.id_unidad || unidad.id_caja;
    document.getElementById('edit-name').value = unidad.nombre;
    document.getElementById('edit-type').value = unidad.tipo;
    document.getElementById('edit-description').value = unidad.descripcion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('unit-edit-form');
    // Referencias para validación
    const nombreIn = document.getElementById('edit-name');
    const descripcionIn = document.getElementById('edit-description');

    const nombreError = document.getElementById('error-editName');
    const descripcionError = document.getElementById('error-editDescription');

    // Validaciones
    textValidate(nombreIn, nombreError)
    textValidate(descripcionIn, descripcionError)

    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_unidad = document.getElementById('edit-id-unit').value;
    const tipo = document.getElementById('edit-type').value;
    const updatedData = {
        nombre: nombreIn.value,
        descripcion: descripcionIn.value
    };

    try {
        if (tipo === 'Unidad') {
            await updateUnit(id_unidad, updatedData);
        } else {
            await updateBox(id_unidad, updatedData);
        }

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('unidad actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderUnitsTable();
    } catch (err) {
        console.error('Error al actualizar unidad:', err);
        alert('Ocurrió un error al actualizar la unidad.');
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idUnit = document.getElementById('delete-id-unit').value;
    const tipo = document.getElementById('delete-type').value;

    if (tipo === 'Unidad') {
        await deleteUnit(idUnit);
    } else {
        await deleteBox(idUnit);
    }

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Unidad eliminada correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderUnitsTable();
});