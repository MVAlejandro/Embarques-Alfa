import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createOrder } from '../../services/order-service.js'; 
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';
import { textValidate, amountValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Cargar los clientes en los formularios al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('cliente-excel', 'emb_clientes', 'id_cliente', 'nombre')
    loadOptions('cliente', 'emb_clientes', 'id_cliente', 'nombre')
})

// Función para agregar orden de forma manual
export async function addManualOrder(event) {
    event.preventDefault()

    const form = document.getElementById('form-manual');
    // Referencias para validación
    const id_clienteIn = document.getElementById("cliente");
    const numero_ordenIn = document.getElementById("numero_orden");
    const numero_contratoIn = document.getElementById("numero_contrato");
    const fechaIn = document.getElementById("fecha");
    const observacionesIn = document.getElementById("observaciones");
    // Referencias para errores
    const id_clienteError = document.getElementById('cliente-error');
    const numero_ordenError = document.getElementById('numero_orden-error');
    const numero_contratoError = document.getElementById('numero_contrato-error');
    const fechaError = document.getElementById('fecha-error');
    const observacionesError = document.getElementById('observaciones-error');

    // Validaciones
    selectValidate(id_clienteIn, id_clienteError)
    amountValidate(numero_ordenIn, numero_ordenError)
    amountValidate(numero_contratoIn, numero_contratoError)
    textValidate(observacionesIn, observacionesError)

    const campos = form.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    let condicion = "En plan diario";
    let acuerdo = "En plan diario";


    // Guardar valores
    const newOrderData = {
        id_cliente: id_clienteIn.value,
        numero_orden: numero_ordenIn.value,
        numero_contrato: numero_contratoIn.value,
        fecha: fechaIn.value,
        condicion,
        acuerdo,
        observaciones: observacionesIn.value
    };

    try {
        await createOrder(newOrderData);
        alert('Orden agregada con éxito.');
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        await renderOrdersTable();
    } catch (err) {
        console.error('Error al agregar orden:', err);
        alert('Ocurrió un error al agregar la orden de compra.');
    }
}

// Función para agregar orden con el formato de Excel
export async function addExcelOrder(event) {
    event.preventDefault();

    const form = document.getElementById('form-excel');
    // Referencias para validación y errores
    const id_cliente = document.getElementById("cliente-excel").value
    const excelData = document.getElementById('excel-data').value

    const id_clienteIn = document.getElementById("cliente-excel")
    const excelDataIn = document.getElementById('excel-data')

    const clienteError = document.getElementById("cliente-excel-error")
    const excelDataError = document.getElementById('error-excel-data')

    // Validaciones
    selectValidate(id_clienteIn, clienteError)
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
    let insertedOrders = 0;

    for (let row of rows) {
        const columns = row.split('\t');
        if (columns.length < 4) continue;

        const numero_orden = columns[0].trim();
        const numero_contrato = columns[1].trim();
        const fecha = columns[2].trim();
        const observaciones = columns[3].trim();

        let condicion = "En plan diario";
        let acuerdo = "En plan diario";

        // Insertar en Supabase
        const newOrderData = {
            id_cliente,
            numero_orden,
            numero_contrato,
            fecha,
            condicion,
            acuerdo,
            observaciones
        };

        try {
            await createOrder(newOrderData);
            insertedOrders++;
        } catch (err) {
            console.error('Error al insertar orden:', newOrderData, err);
        }
    }

    alert(`Se agregaron ${insertedOrders} órdenes.`);
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
        e.classList.remove('is-valid', 'is-invalid');
    });

    // Recarga la tabla con los datos actualizados
    await renderOrdersTable();
};