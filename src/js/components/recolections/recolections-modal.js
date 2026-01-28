// Servicios Supabase
import { updateRecolection } from '../../services/recolections-service.js'; 
import { getRecolectionProducts, updateRecolectionProducts } from '../../services/recolection-product-service.js';
import { recolectionsFilter } from './recolections-filter.js';  
import { getProducts } from '../../services/order-product-service.js';
import { renderRecolectionsTable } from './recolections-table.js';
// Utilidades
import { textValidate, amountValidate, inputValidate } from '../../utils/form-validations.js';
import { loadOptionsFilter } from '../../utils/load-select.js';

// Función para agregar campos de productos
async function addProductRow(selectedProductId = '0', cantidadValue = '') {
    const container = document.getElementById("recolection-products-container");
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `product-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = "row ms-2 me-2 pt-2 pb-2 product-item";
    newProduct.innerHTML =
        `<div class="col-6">
            <select class="form-select product-select" id="${uniqueId}-select" data-index="${index}">
                <option value="0">Seleccionar producto</option>
            </select>
        </div>
        <div class="col-4">
            <input type="number" id="${uniqueId}-cantidad" class="form-control product-input" placeholder="Cantidad" data-index="${index}" value="${cantidadValue}">
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
            <button type="button" class="btn btn-remove" data-index="${index}">X</button>
        </div>`;

    container.appendChild(newProduct);

    // Cargar opciones en el select
    await loadOptionsFilter(`${uniqueId}-select`, getProducts, ['codigo', 'nombre'], 'id_producto', "Seleccione Producto...", selectedProductId);
}

// Agregar entrada de producto
document.getElementById('btn-add-product').addEventListener('click', addProductRow);

// Eliminar entrada de producto
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-remove')) {
        e.target.closest('.product-item').remove();
    }
});

// Función para cargar datos en el modal
export async function renderRecolectionsEditModal(recoleccion) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-recolection').value = recoleccion.id_recoleccion;
    document.getElementById('edit-date').value = recoleccion.fecha_programada;
    document.getElementById('edit-supplier').value = recoleccion.proveedor;
    document.getElementById('edit-destination').value = recoleccion.destino || recoleccion.ubicacion;
    document.getElementById('edit-observations').value = recoleccion.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("recolection-products-container");
    container.innerHTML = '';
    
    // Obtener productos de la orden
    const productos = await getRecolectionProducts(recoleccion.id_recoleccion);
    
    // Agregar una fila por cada producto
    for (const product of productos) {
        await addProductRow(product.id_producto, product.cantidad_recoleccion);
    }
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const dateIn = document.getElementById('edit-date');
    const destinationIn = document.getElementById('edit-destination');
    const observationsIn = document.getElementById('edit-observations');

    const destinationError = document.getElementById('error-editDestination');
    const observationsError = document.getElementById('error-editObservations');

    // Validaciones
    textValidate(destinationIn, destinationError)
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

    const id_recoleccion = document.getElementById('edit-id-recolection').value;
    const updatedData = { 
        fecha_programada: dateIn.value,
        destino: destinationIn.value,
        observaciones: observationsIn.value
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