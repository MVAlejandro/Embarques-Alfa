import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createClient } from '../../services/client-service.js';
import { renderClientsTable } from './clients-table.js';
// Utilidades
import { nameValidate, textValidate, rfcValidate, emailValidate, phoneValidate, cpValidate, inputValidate } from '../../utils/form-validations.js';

// Función para agregar un cliente de forma manual
export async function addManualClient(event) {
    event.preventDefault()

    const form = document.getElementById('form-manual');
    // Referencias para validación
    const nombreIn = document.getElementById("nombre");
    const razon_socialIn = document.getElementById("razon_social");
    const rfcIn = document.getElementById("rfc");
    const numero_telefonoIn = document.getElementById("numero_telefono");
    const correoIn = document.getElementById("correo");
    const codigo_postalIn = document.getElementById("codigo_postal");
    const ubicacionIn = document.getElementById("ubicacion");
    // Referencias para errores
    const nombreError = document.getElementById('error-nombre');
    const razon_socialError = document.getElementById('error-razon_social');
    const rfcError = document.getElementById('error-rfc');
    const numero_telefonoError = document.getElementById('error-numero_telefono');
    const correoError = document.getElementById('error-correo');
    const codigo_postalError = document.getElementById('error-codigo_postal');
    const ubicacionError = document.getElementById('error-ubicacion');

    // Validaciones
    nameValidate(nombreIn, nombreError)
    textValidate(razon_socialIn, razon_socialError)
    rfcValidate(rfcIn, rfcError)
    phoneValidate(numero_telefonoIn, numero_telefonoError)
    emailValidate(correoIn, correoError)
    cpValidate(codigo_postalIn, codigo_postalError)
    textValidate(ubicacionIn, ubicacionError)

    const campos = form.querySelectorAll('input')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Guardar valores
    const newClientData = {
        razon_social: razon_socialIn.value,
        rfc: rfcIn.value,
        nombre: nombreIn.value,
        codigo_postal: codigo_postalIn.value,
        ubicacion: ubicacionIn.value,
        numero_telefono: numero_telefonoIn.value,
        correo: correoIn.value
    };

    try {
        await createClient(newClientData);
        alert('Cliente agregado con éxito.');
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        await renderClientsTable();
    } catch (err) {
        console.error('Error al agregar cliente:', err);
        alert('Ocurrió un error al agregar el cliente.');
    }
}

// Función para agregar clientes con el formato de Excel
export async function addExcelClient(event) {
    event.preventDefault();

    const form = document.getElementById('form-excel');
    // Referencias para validación y errores
    const excelData = document.getElementById('excel-data').value
    const excelDataIn = document.getElementById('excel-data')
    const excelDataError = document.getElementById('error-excel-data')

    // Validaciones
    textValidate(excelDataIn, excelDataError)

    if (!excelData) {
        alert('Por favor, ingrese la información para agregar la entrada.')
        return
    }

    const campos = form.querySelectorAll('input')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    // Dividir las filas y columnas
    const rows = excelData.split('\n');
    let insertedClients = 0;

    for (let row of rows) {
        const columns = row.split('\t');
        if (columns.length < 7) continue;

        const nombre = columns[0].trim();
        const razon_social = columns[1].trim();
        const rfc = columns[2].trim();
        const numero_telefono = columns[3].trim();
        const correo = columns[4].trim();
        const codigo_postal = columns[5].trim();
        const ubicacion = columns[6].trim();

        // Insertar en Supabase
        const newClientData = {
            nombre,
            razon_social,
            rfc,
            numero_telefono,
            correo,
            codigo_postal,
            ubicacion
        };

        try {
            await createClient(newClientData);
            insertedClients++;
        } catch (err) {
            console.error('Error al insertar cliente:', newClientData, err);
        }
    }

    alert(`Se agregaron ${insertedClients} clientes.`);
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    // Recarga la tabla con los datos actualizados
    await renderClientsTable();
};