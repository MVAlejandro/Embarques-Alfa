// Servicios Supabase
import { getPartitions } from "../../services/partitions-service";
import { getPartitionProducts } from "../../services/partition-product-service";
import { planningFilter } from "../../utils/planning-filters";
import { generateExistentForm, generateNewForm } from "../rejections/generate-form";
import { createRejection, findRejection } from "../../services/rejections-service";
import { getRejectionProducts, updateRejectionProducts } from "../../services/rejection-product-service";
import { renderPartitionsTable } from "./partitions-table";
import { validateUserRole } from "../../utils/session-validate";
// Utilidades
import { inputValidate, textValidate } from "../../utils/form-validations";
import { validateProductRow, viewProductRow } from "../../utils/modal-product-rows";
import { getWeekAndYear } from "../../utils/week-functions";

// Función para cargar datos en el modal de información
export async function renderRejectionInfoModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('info-id-partition').value = partida.id_partida;
    document.getElementById('info-oc').value = partida.numero_orden;
    document.getElementById('info-contract').value = partida.numero_contrato;
    document.getElementById('info-client').value = partida.cliente;

    const rejection = await findRejection(partida.id_partida);

    if (rejection) {
        await generateExistentForm();
        // Limpiar filas anteriores
        const container = document.getElementById("rejection-products-container");
        container.innerHTML = '';

        document.getElementById('id-rejection').value = rejection.id_rechazo;
        document.getElementById('rejection-date').value = rejection.fecha_rechazo;
        document.getElementById('rejection-observations').value = rejection.observaciones;
        
        // Obtener los productos del rechazo
        const rejectionProducts = await getRejectionProducts(rejection.id_rechazo);

        // Mostrar productos en el modal
        for (const product of rejectionProducts) {
            await viewProductRow("rejection", product.id_producto, product.codigo, product.producto, product.cantidad_rechazada ?? 0,);
        }

        // Bloquear botón para generación de rechazo
        document.getElementById('btn-save').textContent = 'Generado';
        document.getElementById('btn-save').disabled = true;

        validateUserRole()

    } else {
        await generateNewForm();
        // Limpiar filas anteriores
        const container = document.getElementById("rejection-products-container");
        container.innerHTML = '';

        // Obtener los productos de la partida
        const partitionProducts = await getPartitionProducts(partida.id_partida);

        // Mostrar productos en el modal
        for (const product of partitionProducts) {
            const orderProductId = product.id_orden_producto;
                
            // Cantidad máxima a ingresar
            const maxValue = product.cantidad_solicitada
        
            await validateProductRow("rejection", orderProductId, product.codigo, product.producto, '', maxValue,);
        }

        // Desbloquear botón para generación de rechazo
        document.getElementById('btn-save').textContent = 'Generar';
        document.getElementById('btn-save').disabled = false;

        validateUserRole()
    }
}

// Función para guardar cambios
document.getElementById('btn-save').addEventListener('click', async function() {
    // Referencias para actualizar información
    const dateIn = document.getElementById('rejection-date');
    const observationsIn = document.getElementById('rejection-observations');

    const dateError = document.getElementById('error-rejectDate');
    const observationsError = document.getElementById('error-rejectObservations');

    // Validaciones
    textValidate(dateIn, dateError)
    textValidate(observationsIn, observationsError)

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

    // Darle formato a la fecha
    const [y, m, d] = dateIn.value.split('-').map(Number);
    const fechaDate = new Date(y, m - 1, d);
    const today = new Date().toLocaleDateString('en-CA');
    
    const { semana, anio } = getWeekAndYear(fechaDate);

    const id_partida = document.getElementById('info-id-partition').value;

    const rejectionData = { 
        id_partida,
        fecha: today,
        fecha_rechazo: dateIn.value,
        semana,
        anio,
        estado: 'Generado',
        observaciones: observationsIn.value
    };

    try {
        const id_rechazo = await createRejection(rejectionData)
        await updateRejectionProducts(id_rechazo);

        // Cerrar el modal y mostrar alerta
        bootstrap.Offcanvas.getInstance(document.getElementById('rejection')).hide();
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Rechazo creado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(getPartitions, renderPartitionsTable);
    } catch (err) {
        console.error('Error al generar rechazo:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al generar el rechazo.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});