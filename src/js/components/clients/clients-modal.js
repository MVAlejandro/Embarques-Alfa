import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateClient, deleteClient } from '../../services/client-service.js';
import { renderClientsTable } from './clients-table.js';
// Utilidades
import { nameValidate, textValidate, rfcValidate, emailValidate, phoneValidate, cpValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderClientsEditModal(cliente) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-cliente').value = cliente.id_cliente;
    document.getElementById('edit-nombre').value = cliente.nombre;
    document.getElementById('edit-razon').value = cliente.razon_social;
    document.getElementById('edit-rfc').value = cliente.rfc;
    document.getElementById('edit-telefono').value = cliente.numero_telefono;
    document.getElementById('edit-correo').value = cliente.correo;
    document.getElementById('edit-cp').value = cliente.codigo_postal;
    document.getElementById('edit-ubicacion').value = cliente.ubicacion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para validación
    const nombreIn = document.getElementById('edit-nombre');
    const razon_socialIn = document.getElementById('edit-razon');
    const rfcIn = document.getElementById('edit-rfc');
    const numero_telefonoIn = document.getElementById('edit-telefono');
    const correoIn = document.getElementById('edit-correo');
    const codigo_postalIn = document.getElementById('edit-cp');
    const ubicacionIn = document.getElementById('edit-ubicacion');

    const nombreError = document.getElementById('error-editNombre');
    const razon_socialError = document.getElementById('error-editRazon');
    const rfcError = document.getElementById('error-editRfc');
    const numero_telefonoError = document.getElementById('error-editTelefono');
    const correoError = document.getElementById('error-editCorreo');
    const codigo_postalError = document.getElementById('error-editCp');
    const ubicacionError = document.getElementById('error-editUbicacion');

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
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_cliente = document.getElementById('edit-id-cliente').value;
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
        await updateClient(id_cliente, updatedData);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Cliente actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderClientsTable();
    } catch (err) {
        console.error('Error al actualizar cliente:', err);
        alert('Ocurrió un error al actualizar el cliente.');
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idClient = document.getElementById('delete-id-cliente').value;
    await deleteClient(idClient);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Cliente eliminado correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderClientsTable();
});