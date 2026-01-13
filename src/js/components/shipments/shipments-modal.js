// Servicios Supabase
import { updatePartition } from '../../services/partitions-service.js';
import { getPartitionProducts, updateShipmentProducts, getAllPartitionProductsByOrder } from '../../services/partition-product-service.js';
import { getOrderProducts } from '../../services/order-product-service.js';
import { planningFilter } from '../../utils/planning-filters.js'; 
import { renderShipmentsTable } from './shipments-table.js'; 
import { validateUserRole } from '../../utils/session-validate.js';
// Utilidades
import { textValidate, amountValidate, inputValidate } from '../../utils/form-validations.js';

// Función para agregar campos de productos
async function addProductRow(idOrdenProducto, productoCodigo = '', productoNombre = '', cantidadValue = '', data) {
    const container = document.getElementById("shipment-products-container");
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
            <input type="number" id="${uniqueId}-cantidad" class="form-control product-amount" placeholder="Cantidad" value="${cantidadValue}" disabled ${data}>
            <p class="error invalid-feedback" id="${uniqueId}-cantidad-error" style="color: red;"></p>
        </div>`;

    container.appendChild(newProduct);

    const productoIn = newProduct.querySelector(".product-amount");
    const productoError = newProduct.querySelector(`#${uniqueId}-cantidad-error`);

    // Validar en tiempo real
    productoIn.addEventListener("input", () => {
        amountValidate(productoIn, productoError);
    });
}

// Función para cargar datos en el modal
export async function renderShipmentsEditModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-partition').value = partida.id_partida;
    document.getElementById('edit-date').value = partida.fecha_programada;
    document.getElementById('edit-time').value = partida.hora_programada;
    document.getElementById('edit-real-time').value = partida.hora_realizada != null ? partida.hora_realizada.slice(0, 5) : "";
    document.getElementById('edit-oc').value = partida.numero_orden;
    document.getElementById('edit-status').value = partida.embarque;
    document.getElementById('edit-remision').value = partida.numero_remision;
    document.getElementById('edit-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('edit-observations').value = partida.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("shipment-products-container");
    container.innerHTML = '';
        
    // Obtener los productos de la orden
    const orderProducts = await getOrderProducts(partida.id_orden);
    
    // Cargar lo asignado en la partida actual para rellenar inputs
    const currentPartitionProducts = await getPartitionProducts(partida.id_partida);
    const currentProductsMap = {};
    
    for (const row of currentPartitionProducts) {
        currentProductsMap[row.id_orden_producto] = row.cantidad_embarcada;
    }

    // Mostrar productos en el modal
    for (const product of orderProducts) {
        const orderProductId = product.id_orden_producto;
            
        // Valor a mostrar
        const visibleQuantity = currentProductsMap[orderProductId] || 0;
    
        await addProductRow(orderProductId, product.codigo, product.producto, visibleQuantity, "data-prod-only",);
    }
    
    validateUserRole()
}

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('shipment-edit-form');
    // Referencias para validación
    const horaRealIn = document.getElementById('edit-real-time');
    const statusIn = document.getElementById('edit-status');
    const remisionIn = document.getElementById('edit-remision');
    const observacionesIn = document.getElementById('edit-observations');
    
    const horaRealError = document.getElementById('error-editHour');
    const statusError = document.getElementById('error-editStatus');
    const remisionError = document.getElementById('error-editRemision');
    const observacionesError = document.getElementById('error-editObservations');

    // Validaciones
    textValidate(horaRealIn, horaRealError)
    textValidate(observacionesIn, observacionesError)

    const campos = document.querySelectorAll('input')
    if (!inputValidate(campos)) {
        alert('Corrige los errores antes de guardar.')
        return
    }

    if (statusIn.value === 'Planeado') {
        statusIn.classList.add('is-invalid');
        statusError.textContent = 'Se debe seleccionar una opción';
        return
    }

    // Registrar la hora de embarque real
    if (statusIn.value === 'Cargado') {
        horaRealIn.value = new Date().toTimeString().slice(0, 8);
    }

    const id_partida = document.getElementById('edit-id-partition').value;
    const updatedData = { 
        hora_realizada: horaRealIn.value,
        embarque: statusIn.value,
        numero_remision: remisionIn.value,
        observaciones: observacionesIn.value
    };

    try {
        await updatePartition(id_partida, updatedData);
        await updateShipmentProducts(id_partida);

        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        alert('Estado del embarque actualizado correctamente.');

        // Recarga la tabla con los datos actualizados
        planningFilter(renderShipmentsTable);
    } catch (err) {
        console.error('Error al actualizar partida:', err);
        alert('Ocurrió un error al actualizar la partida.');
    }
});