// Servicios Supabase
import { updatePartition } from '../../services/partitions-service.js'; 
import { getPartitionProducts, addPartitionProducts, getAllPartitionProductsByOrder } from '../../services/partition-product-service.js';
import { getOrderProducts } from '../../services/order-product-service.js';
import { renderProductionTable } from './production-table.js'; 
import { validateUserRole } from '../../utils/session-validate.js';
// Utilidades
import { quantityValidate } from '../../utils/form-validations.js';

// Función para agregar campos de productos
async function addProductRow(idOrdenProducto, productoCodigo = '', productoNombre = '', cantidadValue = '', maxValue) {
    const container = document.getElementById("partition-products-container");
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `product-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = "row ms-2 me-2 pt-2 pb-2 product-item";
    newProduct.dataset.idOrdenProducto = idOrdenProducto;
    newProduct.innerHTML = 
        `<div class="col-7">
        <input type="text" id="${uniqueId}-producto" class="form-control product-code" placeholder="Producto" value="${productoCodigo} - ${productoNombre}" disabled>
        </div>
        <div class="col-5">
            <input type="number" id="${uniqueId}-cantidad" class="form-control product-amount" placeholder="Cantidad" value="${cantidadValue}" data-max="${maxValue}" disabled data-vent-only data-prod-only>
            <p class="error invalid-feedback" id="${uniqueId}-cantidad-error" style="color: red;"></p>
        </div>`;

    container.appendChild(newProduct);

    const productoIn = newProduct.querySelector(".product-amount");
    const productoError = newProduct.querySelector(`#${uniqueId}-cantidad-error`);

    // Validar en tiempo real
    productoIn.addEventListener("input", () => {
        quantityValidate(productoIn, productoError, maxValue);
    });
}

// Función para cargar datos en el modal
export async function renderProductionEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-status').value = partida.planta;

    // Limpiar filas anteriores
    const container = document.getElementById("partition-products-container");
    container.innerHTML = '';
    
    // Obtener los productos de la orden
    const orderProducts = await getOrderProducts(partida.id_orden);
    // Obtener todas las partidas-producto de la orden
    const partitionProducts = await getAllPartitionProductsByOrder(partida.id_orden);
    // Crear mapa de lo que ya se asignó en otras partidas
    const asignedProductsMap = {};

    for (const row of partitionProducts) {
        // Ignorar la partida actual
        if (row.id_partida === partida.id_partida) continue;

        const orderProductId = row.id_orden_producto;

        if (!asignedProductsMap[orderProductId]) asignedProductsMap[orderProductId] = 0;
        asignedProductsMap[orderProductId] += row.cantidad_partida;
    }

    // Cargar lo asignado en la partida actual para rellenar inputs
    const currentPartitionProducts = await getPartitionProducts(partida.id_partida);
    const currentProductsMap = {};

    for (const row of currentPartitionProducts) {
        currentProductsMap[row.id_orden_producto] = row.cantidad_partida;
    }

    // Mostrar productos en el modal
    for (const product of orderProducts) {
        const orderProductId = product.id_orden_producto;

        const orderQuantity = product.cantidad_orden;
        const otherPartitionQuantity = asignedProductsMap[orderProductId] || 0;
        const currentPartitionQuantity = currentProductsMap[orderProductId] || 0;

        const maxValue = orderQuantity - otherPartitionQuantity;

        // Valor a mostrar
        const visibleQuantity = currentPartitionQuantity || 0;

        await addProductRow(orderProductId, product.codigo, product.producto, visibleQuantity, maxValue,);
    }

    validateUserRole()
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const statusIn = document.getElementById('edit-status');
    const statusError = document.getElementById('error-editStatus');
    if (statusIn.value === 'Pendiente') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { planta:statusIn.value };

    try {
        await updatePartition(id_partida, updatedData);
        await addPartitionProducts(id_partida);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Estado de producción actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        await renderProductionTable();
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        alert('Ocurrió un error al actualizar la partida.');
    }
});