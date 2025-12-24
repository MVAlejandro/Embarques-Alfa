import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateOrder, deleteOrder } from '../../services/orders-service.js';
import { getOrderProducts, addOrderProducts } from '../../services/order-product-service.js';
import { getProducts } from '../../services/order-product-service.js';
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { textValidate, amountValidate, inputValidate } from '../../utils/form-validations.js';
import { loadOptionsFilter } from '../../utils/load-select.js';

// Función para cargar datos en el modal
export async function renderOrdersEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-order').value = orden.id_orden;
    document.getElementById('edit-client').value = orden.cliente;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-contract').value = orden.numero_contrato;
    document.getElementById('edit-date').value = orden.fecha;

    // Limpiar filas anteriores
    const container = document.getElementById("order-products-container");
    container.innerHTML = '';

    // Obtener productos de la orden
    const productos = await getOrderProducts(orden.id_orden);

    // Agregar una fila por cada producto
    for (const product of productos) {
        await addProductRow(product.id_producto, product.cantidad_orden);
    }
}

// Función para agregar campos de productos
async function addProductRow(selectedProductId = '0', cantidadValue = '') {
    const container = document.getElementById("order-products-container");
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

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('order-edit-form');
    // Referencias para validación
    const numero_ordenIn = document.getElementById('edit-oc');
    const numero_contratoIn = document.getElementById('edit-contract');

    const numero_ordenError = document.getElementById('error-editOc');
    const numero_contratoError = document.getElementById('error-editContract');

    // Validaciones
    amountValidate(numero_ordenIn, numero_ordenError)
    amountValidate(numero_contratoIn, numero_contratoError)

    const campos = document.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    const id_orden = document.getElementById('edit-id-order').value;
    const updatedData = {
        numero_orden: numero_ordenIn.value,
        numero_contrato: numero_contratoIn.value
    };

    try {
        await updateOrder(id_orden, updatedData);
        await addOrderProducts(id_orden);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Orden de compra actualizada correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderOrdersTable();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        alert('Ocurrió un error al actualizar la orden de compra.');
    }
});

// Eliminar entrada al dar click en el botón del modal
document.getElementById('btn-delete-entry').addEventListener('click', async () => {
    const idOrder = document.getElementById('delete-id-order').value;
    await deleteOrder(idOrder);

    // Cerrar el modal y mostrar alerta
    bootstrap.Modal.getInstance(document.getElementById('delete-modal')).hide();
    alert('Orden de compra eliminada correctamente.');

    // Recarga la tabla con los datos actualizados
    await renderOrdersTable();
});