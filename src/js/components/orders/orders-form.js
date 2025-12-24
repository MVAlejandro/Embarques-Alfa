import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createOrder } from '../../services/orders-service.js'; 
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { loadOptions } from '../../utils/load-select.js';
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';

// Cargar los clientes en los formularios al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptions('cliente-excel', 'emb_clientes', 'id_cliente', 'nombre', 'Seleccione...')
    loadOptions('cliente', 'emb_clientes', 'id_cliente', 'nombre', 'Seleccione...')
})

// Función para calcular y asignar semana y año
function getWeekAndYear(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7; // lunes=1, domingo=7

    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    
    return { semana: week, anio: d.getUTCFullYear() };
}

// Función para agregar orden de forma manual
export async function addManualOrder(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add-manual');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('form-manual');
    // Referencias para validación
    const id_clienteIn = document.getElementById("cliente");
    const numero_ordenIn = document.getElementById("numero_orden");
    const numero_contratoIn = document.getElementById("numero_contrato");
    // Referencias para errores
    const id_clienteError = document.getElementById('cliente-error');
    const numero_ordenError = document.getElementById('numero_orden-error');
    const numero_contratoError = document.getElementById('numero_contrato-error');

    // Validaciones
    selectValidate(id_clienteIn, id_clienteError)
    textValidate(numero_ordenIn, numero_ordenError)
    textValidate(numero_contratoIn, numero_contratoError)

    const campos = form.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')

        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
        return
    }

    const fecha = new Date();
    const { semana, anio } = getWeekAndYear(fecha);

    // Guardar valores
    const newOrderData = {
        id_cliente: id_clienteIn.value,
        numero_orden: numero_ordenIn.value,
        numero_contrato: numero_contratoIn.value,
        fecha: fecha.toISOString().split('T')[0],
        semana,
        anio
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
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
    }
}

// Función para agregar orden con el formato de Excel
export async function addExcelOrder(event) {
    event.preventDefault();

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add-excel');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

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

        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
                <p class="ps-2">Agregar</p>`;
        }
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
        if (columns.length < 2) continue;

        const numero_orden = columns[0].trim();
        const numero_contrato = columns[1].trim();
        const fecha = new Date();
        const { semana, anio } = getWeekAndYear(fecha);

        // Insertar en Supabase
        const newOrderData = {
            id_cliente,
            numero_orden,
            numero_contrato,
            fecha: fecha.toISOString().split('T')[0],
            semana,
            anio
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

    // Restaurar estado del botón
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = 
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                <path d="M11 2H9v3h2z"/>
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg>
            <p class="ps-2">Agregar</p>`;
    }

    // Recarga la tabla con los datos actualizados
    await renderOrdersTable();
};