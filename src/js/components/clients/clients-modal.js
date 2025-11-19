import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateClient, deleteClient } from '../../services/clients-service.js';
import { renderClientsTable } from './clients-table.js';
// Utilidades
import { nameValidate, textValidate, rfcValidate, emailValidate, phoneValidate, cpValidate, inputValidate } from '../../utils/form-validations.js';

// Función para cargar datos en el modal
export async function renderClientsEditModal(cliente) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-client').value = cliente.id_cliente;
    document.getElementById('edit-name').value = cliente.nombre;
    document.getElementById('edit-company').value = cliente.razon_social;
    document.getElementById('edit-rfc').value = cliente.rfc;
    document.getElementById('edit-phone').value = cliente.numero_telefono;
    document.getElementById('edit-email').value = cliente.correo;
    document.getElementById('edit-cp').value = cliente.codigo_postal;
    document.getElementById('edit-location').value = cliente.ubicacion;
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('client-edit-form');
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
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_cliente = document.getElementById('edit-id-client').value;
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

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
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
    const idClient = document.getElementById('delete-id-client').value;
    await deleteClient(idClient);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Cliente eliminado correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderClientsTable();
});