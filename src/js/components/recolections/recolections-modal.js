// Servicios Supabase
import { updateRecolection } from '../../services/recolections-service.js'; 
import { getRecolectionProducts, updateRecolectionProducts } from '../../services/recolection-product-service.js';
import { recolectionsFilter } from './recolections-filter.js';  
import { renderRecolectionsTable } from './recolections-table.js';
// Utilidades
import { textValidate, inputValidate } from '../../utils/form-validations.js';
import { selectProductRow } from '../../utils/modal-product-rows.js';

// Función para cargar datos en el modal
export async function renderRecolectionsEditModal(recoleccion) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-recolection').value = recoleccion.id_recoleccion;
    document.getElementById('edit-date').value = recoleccion.fecha_programada;
    document.getElementById('edit-supplier').value = recoleccion.proveedor;
    document.getElementById('edit-destination').value = recoleccion.destino || recoleccion.ubicacion;
    document.getElementById('edit-observations').value = recoleccion.observaciones;
    document.getElementById('edit-status').value = recoleccion.transporte;

    // Limpiar filas anteriores
    const container = document.getElementById("recolection-products-container");
    container.innerHTML = '';
    
    // Obtener productos de la orden
    const productos = await getRecolectionProducts(recoleccion.id_recoleccion);
    
    // Agregar una fila por cada producto
    for (const product of productos) {
        await selectProductRow("recolection", product.id_producto, product.cantidad_recoleccion);
    }
}

// Agregar entrada de producto
document.getElementById('btn-add-product').addEventListener('click', () => {
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

    const destinationError = document.getElementById('error-editDestination');
    const observationsError = document.getElementById('error-editObservations');
    const statusError = document.getElementById('error-editStatus');

    // Validaciones
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
        await updateRecolection(id_recoleccion, updatedData);
        await updateRecolectionProducts(id_recoleccion);

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