// Servicios Supabase
import { updateRecolection } from '../../services/recolections-service.js'; 
import { getRecolectionProducts, updateRecolectedProducts, updateRecolectionProducts } from '../../services/recolection-product-service.js';
import { recolectionsFilter } from './recolections-filter.js';  
import { renderRecolectionsTable } from './recolections-table.js';
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';
import { selectProductRow, validateProductRow, viewProductRow } from '../../utils/modal-product-rows.js';

const btnAddProd = document.getElementById('btn-add-product');
const recolectedContainer = document.getElementById('recolected-products');

// Función para cargar datos en el modal
export async function renderRecolectionsEditModal(recoleccion) {
    const form = document.getElementById('recolection-edit-form');
    // Insertar valores en los inputs
    document.getElementById('edit-id-recolection').value = recoleccion.id_recoleccion;
    document.getElementById('edit-date').value = recoleccion.fecha_programada;
    document.getElementById('edit-supplier').value = recoleccion.proveedor;
    document.getElementById('edit-destination').value = recoleccion.destino || recoleccion.ubicacion;
    document.getElementById('edit-observations').value = recoleccion.observaciones;
    document.getElementById('edit-status').value = recoleccion.transporte;

    // Habilitar o no el formulario en base al estado de la recolección
    if (recoleccion.transporte === "Recolectado") {
        form.querySelectorAll('.block-field').forEach(element => {
            element.disabled = true;
        });
    } else {
        form.querySelectorAll('.block-field').forEach(element => {
            element.disabled = false;
        });
    }

    // Obtener productos de la recolección
    const productos = await getRecolectionProducts(recoleccion.id_recoleccion);
    // Limpiar filas anteriores
    const container1 = document.getElementById("recolection-products-container");
    const container2 = document.getElementById("recolected-products-container");
    container1.innerHTML = '';
    container2.innerHTML = '';

    if (recoleccion.transporte === "Recolectado") {
        // Limpiar filas anteriores
        btnAddProd.classList.add('d-none');
        recolectedContainer.classList.remove('d-none');

        // Agregar una fila por cada producto
        for (const product of productos) {
            await viewProductRow("recolection", product.id_producto, product.codigo, product.producto, product.cantidad_recoleccion ?? 0);
            await validateProductRow("recolected", product.id_producto, product.codigo, product.producto, product.cantidad_recolectada ?? product.cantidad_recoleccion);
        }
    } else {
        // Limpiar filas anteriores
        btnAddProd.classList.remove('d-none');
        recolectedContainer.classList.add('d-none');
        
        // Agregar una fila por cada producto
        for (const product of productos) {
            await selectProductRow("recolection", product.id_producto, product.cantidad_recoleccion);
        }
    }
}

// Agregar entrada de producto
btnAddProd.addEventListener('click', () => {
    selectProductRow("recolection");
});

// Eliminar entrada de producto
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-remove')) {
        e.target.closest('.recolectionProduct-item').remove();
    }
});

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const dateIn = document.getElementById('edit-date');
    const destinationIn = document.getElementById('edit-destination');
    const observationsIn = document.getElementById('edit-observations');
    const statusIn = document.getElementById('edit-status');

    const dateError = document.getElementById('error-editDate');
    const destinationError = document.getElementById('error-editDestination');
    const observationsError = document.getElementById('error-editObservations');
    const statusError = document.getElementById('error-editStatus');

    // Validaciones
    textValidate(dateIn, dateError)
    textValidate(destinationIn, destinationError)
    textValidate(observationsIn, observationsError)

    if (statusIn.value === 'Pendiente') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

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

    const id_recoleccion = document.getElementById('edit-id-recolection').value;
    const updatedData = { 
        fecha_programada: dateIn.value,
        destino: destinationIn.value,
        observaciones: observationsIn.value,
        transporte: statusIn.value
    };

    try {
        // Actualizar o crear productos de la recolección
        if (statusIn.value === 'Recolectado') {
            await updateRecolectedProducts(id_recoleccion);
        } else {
            await updateRecolection(id_recoleccion, updatedData);
            await updateRecolectionProducts(id_recoleccion);
        }

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Recolección actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        recolectionsFilter(renderRecolectionsTable);
    } catch (err) {
        console.error('Error al actualizar recolección:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la recoleccion.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});