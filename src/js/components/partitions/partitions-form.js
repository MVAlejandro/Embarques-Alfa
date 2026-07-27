import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { getActiveOrders, getOrderTimes } from '../../services/orders-service.js';
import { createPartition, getPartitions } from '../../services/partitions-service.js'; 
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderPartitionsTable } from '../partitions/partitions-table.js'; 
// Utilidades
import { loadOptionsFilter } from '../../utils/load-select.js';
import { textValidate, inputValidate, selectValidate, timeValidate } from '../../utils/form-validations.js';
import { calculateMaxTime, getWeekAndYear } from '../../utils/week-functions.js';

// Cargar las órdenes en el formulario al iniciar la página
document.addEventListener('DOMContentLoaded', async () => {
    loadOptionsFilter('contrato', getActiveOrders, ['numero_contrato', 'cliente'], 'id_orden', 'Seleccione...')
})

// Función para agregar una partida
export async function addPartition(event) {
    event.preventDefault()

    // Capturar el botón que disparó el evento
    const btn = event.target.closest('#btn-add');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subiendo...';
    }

    const form = document.getElementById('form-partition');
    // Referencias para validación
    const id_ordenIn = document.getElementById("contrato");
    const fecha_programadaIn = document.getElementById("fecha_programada");
    const hora_programadaIn = document.getElementById("hora_programada");
    const destinoIn = document.getElementById("destino");
    const observacionesIn = document.getElementById("observaciones");
    // Referencias para errores
    const id_ordenError = document.getElementById('contrato-error');
    const fecha_programadaError = document.getElementById('fecha_programada-error');
    const hora_programadaError = document.getElementById('hora_programada-error');
    const destinoError = document.getElementById('destino-error');
    const observacionesError = document.getElementById('observaciones-error');

    const times = await getOrderTimes(id_ordenIn.value);
    let minHour = times.h_recepcion_ini.slice(0, 5);
    let maxHour = calculateMaxTime(times.h_recepcion_fin, times.tiempo_traslado);

    // Validaciones
    selectValidate(id_ordenIn, id_ordenError)
    textValidate(fecha_programadaIn, fecha_programadaError)
    timeValidate(hora_programadaIn, hora_programadaError, minHour, maxHour)
    textValidate(observacionesIn, observacionesError)

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
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                <p class="ps-2">Programar</p>`;
        }
        return
    }

    // Darle formato a la fecha
    const [y, m, d] = fecha_programadaIn.value.split('-').map(Number);
    const fechaDate = new Date(y, m - 1, d);
    
    const { semana, anio } = getWeekAndYear(fechaDate);

    // Guardar valores
    const newPartitionData = {
        id_orden: id_ordenIn.value,
        hora_programada: hora_programadaIn.value,
        fecha_programada: fechaDate.toISOString().split('T')[0],
        semana,
        anio,
        destino: destinoIn.value,
        observaciones: observacionesIn.value
    };

    try {
        console.log(newPartitionData);
        
        //await createPartition(newPartitionData);
        Swal.fire({
            title: 'Partida agregada con éxito.',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
    
        // Recarga la tabla con los datos actualizados
        planningFilter(getPartitions, renderPartitionsTable);
    } catch (err) {
        console.error('Error al agregar partida:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al agregar la partida.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        // Restaurar estado del botón
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = 
                `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                <p class="ps-2">Programar</p>`;
        }
    }
}
