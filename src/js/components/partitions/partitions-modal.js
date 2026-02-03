// Servicios Supabase
import { updatePartition } from '../../services/partitions-service.js'; 
import { getPartitionProducts, updatePartitionProducts } from '../../services/partition-product-service.js';
import { getOrderProducts } from '../../services/order-product-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderPartitionsTable } from './partitions-table.js'; 
import { validateUserRole } from '../../utils/session-validate.js';
// Utilidades
import { textValidate, inputValidate, quantityValidate } from '../../utils/form-validations.js';

// Función para agregar campos de productos
async function addProductRow(idOrdenProducto, productoCodigo = '', productoNombre = '', cantidadValue = '', maxValue, data) {
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
            <input type="number" id="${uniqueId}-cantidad" class="form-control product-amount" placeholder="Cantidad" value="${cantidadValue}" data-max="${maxValue}" disabled ${data}>
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
export async function renderPartitionsEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-status').value = partida.planta;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-contract').value = partida.numero_contrato;
    document.getElementById('edit-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('edit-observations').value = partida.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("partition-products-container");
    container.innerHTML = '';
    
    // Obtener los productos de la orden
    const orderProducts = await getOrderProducts(partida.id_orden);

    // Cargar lo asignado en la partida actual para rellenar inputs
    const currentPartitionProducts = await getPartitionProducts(partida.id_partida);
    const currentProductsMap = {};

    for (const row of currentPartitionProducts) {
        currentProductsMap[row.id_orden_producto] = row.cantidad_solicitada;
    }

    // Mostrar productos en el modal
    for (const product of orderProducts) {
        const orderProductId = product.id_orden_producto;
        
        // Valor a mostrar
        const visibleQuantity = currentProductsMap[orderProductId] || 0;
        // Cantidad máxima a ingresar
        const maxValue = product.cantidad_orden

        await addProductRow(orderProductId, product.codigo, product.producto, visibleQuantity, maxValue, "data-vent-only");
    }

    validateUserRole()
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    // Referencias para actualizar información
    const dateIn = document.getElementById('edit-date');
    const statusIn = document.getElementById('edit-status');
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

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        fecha_programada: dateIn.value,
        destino: destinationIn.value,
        observaciones: observationsIn.value
    };

    if (statusIn.value === 'Pendiente') {
        updatedData.planta = 'Planeado';
    }

    try {
        await updatePartition(id_partida, updatedData);
        await updatePartitionProducts(id_partida);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Partida actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        planningFilter(renderPartitionsTable);
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la partida.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});