import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateSupplier, deleteSupplier } from '../../services/suppliers-service.js'; 
import { renderSuppliersTable } from './suppliers-table.js'; 
// Utilidades
import { nameValidate, textValidate, rfcValidate, emailValidate, phoneValidate, cpValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderSuppliersEditModal(proveedor) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-supplier').value = proveedor.id_proveedor;
    document.getElementById('edit-name').value = proveedor.nombre;
    document.getElementById('edit-company').value = proveedor.razon_social;
    document.getElementById('edit-rfc').value = proveedor.rfc;
    document.getElementById('edit-phone').value = proveedor.numero_telefono;
    document.getElementById('edit-email').value = proveedor.correo;
    document.getElementById('edit-cp').value = proveedor.codigo_postal;
    document.getElementById('edit-location').value = proveedor.ubicacion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('supplier-edit-form');
    // Referencias para validación
    const nombreIn = document.getElementById('edit-name');
    const razon_socialIn = document.getElementById('edit-company');
    const rfcIn = document.getElementById('edit-rfc');
    const numero_telefonoIn = document.getElementById('edit-phone');
    const correoIn = document.getElementById('edit-email');
    const codigo_postalIn = document.getElementById('edit-cp');
    const ubicacionIn = document.getElementById('edit-location');

    const nombreError = document.getElementById('error-editName');
    const razon_socialError = document.getElementById('error-editCompany');
    const rfcError = document.getElementById('error-editRfc');
    const numero_telefonoError = document.getElementById('error-editPhone');
    const correoError = document.getElementById('error-editEmail');
    const codigo_postalError = document.getElementById('error-editCp');
    const ubicacionError = document.getElementById('error-editLocation');

    // Validaciones
    nameValidate(nombreIn, nombreError)
    textValidate(razon_socialIn, razon_socialError)
    rfcValidate(rfcIn, rfcError)
    phoneValidate(numero_telefonoIn, numero_telefonoError)
    emailValidate(correoIn, correoError)
    cpValidate(codigo_postalIn, codigo_postalError)
    textValidate(ubicacionIn, ubicacionError)

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

    const id_proveedor = document.getElementById('edit-id-supplier').value;
    const updatedData = {
        razon_social: razon_socialIn.value,
        rfc: rfcIn.value,
        nombre: nombreIn.value,
        codigo_postal: codigo_postalIn.value,
        ubicacion: ubicacionIn.value,
        numero_telefono: numero_telefonoIn.value,
        correo: correoIn.value
    };

    try {
        await updateSupplier(id_proveedor, updatedData);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Proveedor actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderSuppliersTable();
    } catch (err) {
        console.error('Error al actualizar proveedor:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar el proveedor.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
