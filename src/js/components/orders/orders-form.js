import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { createOrder } from '../../services/orders-service.js'; 
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { loadOptionsFilter } from '../../utils/load-select.js';
import { textValidate, inputValidate, selectValidate } from '../../utils/form-validations.js';
import { getWeekAndYear } from '../../utils/week-functions.js';
import { getClients } from '../../services/clients-service.js';

// Cargar los clientes en los formularios al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptionsFilter('cliente', getClients, 'nombre', 'id_cliente', 'Seleccione...')
})

// Función para agregar orden de forma manual
export async function addManualOrder(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add-manual');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('order-form');
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
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
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
        Swal.fire({
            title: 'Orden agregada con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        await renderOrdersTable();
    } catch (err) {
        console.error('Error al agregar orden:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error la orden de compra.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
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
