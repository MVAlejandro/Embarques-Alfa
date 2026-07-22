import supabase from '../../supabase/supabase-client.js'
// Servicios Supabase
import { updateOrder } from '../../services/orders-service.js';
import { getOrderProducts, updateOrderProducts } from '../../services/order-product-service.js';
import { renderOrdersTable } from './orders-table.js'; 
// Utilidades
import { inputValidate, selectValidate, textValidate } from '../../utils/form-validations.js';
import { selectProductRow } from '../../utils/modal-product-rows.js';

// Función para cargar datos en el modal
export async function renderOrdersEditModal(orden) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-order').value = orden.id_orden;
    document.getElementById('edit-client').value = orden.cliente;
    document.getElementById('edit-oc').value = orden.numero_orden;
    document.getElementById('edit-contract').value = orden.numero_contrato;
    document.getElementById('edit-date').value = orden.fecha;
    document.getElementById('edit-status').value = orden.estado;

    // Limpiar filas anteriores
    const container = document.getElementById("order-products-container");
    container.innerHTML = '';

    // Obtener productos de la orden
    const productos = await getOrderProducts(orden.id_orden);

    // Agregar una fila por cada producto
    for (const product of productos) {
        await selectProductRow("order", product.id_producto, product.cantidad_orden);
    }
}

// Agregar entrada de producto
document.getElementById('btn-add-product').addEventListener('click', () => {
    selectProductRow("order");
});

// Eliminar entrada de producto
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn-remove')) {
        e.target.closest('.orderProduct-item').remove();
    }
});

// Función para guardar cambios
document.getElementById('btn-edit-entry').addEventListener('click', async function() {
    const form = document.getElementById('order-edit-form');
    // Referencias para validación
    const ocIn = document.getElementById('edit-oc');
    const contractIn = document.getElementById('edit-contract');
    const estadoIn = document.getElementById('edit-status');

    const ocError = document.getElementById('error-editOc');
    const contractError = document.getElementById('error-editContract');
    const estadoError = document.getElementById('error-editStatus');

    // Validaciones
    textValidate(ocIn, ocError)
    textValidate(contractIn, contractError)
    selectValidate(estadoIn, estadoError)

    const campos = document.querySelectorAll('input, select')
    if (!inputValidate(campos)) {
        Swal.fire({
            title: 'Atención',
            text: 'Corrige los errores antes de guardar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return
    }

    const id_orden = document.getElementById('edit-id-order').value;
    const updatedData = { 
        numero_orden: ocIn.value,
        numero_contrato: contractIn.value,
        estado: estadoIn.value 
    };

    try {
        await updateOrder(id_orden, updatedData);
        await updateOrderProducts(id_orden);

        form.querySelectorAll('.is-valid, .is-invalid').forEach(e => {
            e.classList.remove('is-valid', 'is-invalid');
        });
        
        // Cerrar el modal y mostrar alerta
        bootstrap.Modal.getInstance(document.getElementById('edit-modal')).hide();
        Swal.fire({
            title: 'Orden de compra actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        // Recarga la tabla con los datos actualizados
        await renderOrdersTable();
    } catch (err) {
        console.error('Error al actualizar orden:', err);
        Swal.fire({
            title: 'Oops...',
            text: 'Ocurrió un error al actualizar la orden de compra',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
});
