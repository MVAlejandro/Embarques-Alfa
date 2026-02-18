// Servicios Supabase
import { getPartitionProducts } from "../../services/partition-product-service";
import { getRecolectionProducts } from "../../services/recolection-product-service";
// Utilidades
import { viewProductRow } from "../../utils/modal-product-rows";

// Función para cargar datos de producción en el modal
export async function renderProductionModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('production-date').value = partida.fecha_programada;
    document.getElementById('production-oc').value = partida.numero_orden;
    document.getElementById('production-contract').value = partida.numero_contrato;
    document.getElementById('production-status').value = partida.planta;
    document.getElementById('production-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('production-observations').value = partida.observaciones;

    // Limpiar filas anteriores
    const container = document.getElementById("production-products-container");
    container.innerHTML = '';

    const productos = await getPartitionProducts(partida.id_partida);

    for (const producto of productos) {
        await viewProductRow("production", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_solicitada ?? 0,);
    };
}

// Función para cargar datos de transporte en el modal
export async function renderTransportModal(viaje) {
    // Insertar valores en los inputs
    document.getElementById('transport-date').value = viaje.fecha_programada;
    document.getElementById('transport-time').value = viaje.hora_programada.slice(0, 5);
    document.getElementById('transport-operator').value = viaje.operador || "-";
    document.getElementById('transport-status').value = viaje.transporte;
    document.getElementById('transport-unit').value = viaje.unidad || "-";
    document.getElementById('transport-box').value = viaje.caja || "-";
    document.getElementById('transport-distance').value = viaje.distancia != null ? viaje.distancia.toLocaleString('en-US') + " Km" : "-";
    document.getElementById('transport-fuel').value = viaje.combustible != null ? viaje.combustible.toLocaleString('en-US') + " Lts" : "-";
    document.getElementById('transport-price').value = viaje.costo != null ? "$" + viaje.costo.toLocaleString('en-US'): "-";
    document.getElementById('transport-tag').value = viaje.tag != null ? "$" + viaje.tag.toLocaleString('en-US'): "-";
}
export async function renderTransportInput(partida) {
    // Insertar valores en los inputs
    document.getElementById('transport-status').value = partida.transporte;
}

// Función para cargar datos de embarques en el modal
export async function renderShipmentsModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('shipment-date').value = partida.fecha_programada;
    document.getElementById('shipment-time').value = partida.hora_programada.slice(0, 5);
    document.getElementById('shipment-real-time').value = partida.hora_embarcada != null ? partida.hora_embarcada.slice(0, 5) : "-";
    document.getElementById('shipment-oc').value = partida.numero_orden;
    document.getElementById('shipment-status').value = partida.embarque;
    document.getElementById('shipment-remision').value = partida.numero_remision || "-";
    document.getElementById('shipment-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('shipment-observations').value = partida.observaciones;

    // Limpiar filas anteriores
    const container1 = document.getElementById("partition-products-container");
    const container2 = document.getElementById("shipment-products-container");
    container1.innerHTML = '';
    container2.innerHTML = '';

    const productos = await getPartitionProducts(partida.id_partida);

    for (const producto of productos) {
        await viewProductRow("partition", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_solicitada ?? 0,);
        await viewProductRow("shipment", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_embarcada ?? 0,);
    };
}

// Función para cargar datos de facturación en el modal
export async function renderBillsModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('bill-oc').value = partida.numero_orden;
    document.getElementById('bill-date').value = partida.fecha_programada;
    document.getElementById('bill-remision').value = partida.numero_remision || "-";
    document.getElementById('bill-number').value = partida.numero_facturacion || "-";
    document.getElementById('bill-status').value = partida.facturacion;
}

// Función para cargar datos de recolección en el modal
export async function renderRecolectionsModal(recoleccion) {
    // Insertar valores en los inputs
    document.getElementById('recolection-date').value = recoleccion.fecha_programada;
    document.getElementById('recolection-time').value = recoleccion.hora_programada.slice(0, 5);
    document.getElementById('recolection-real-time').value = recoleccion.hora_recolectada != null ? recoleccion.hora_recolectada.slice(0, 5) : "-";
    document.getElementById('recolection-supplier').value = recoleccion.proveedor;
    document.getElementById('recolection-destination').value = recoleccion.destino || recoleccion.ubicacion;
    document.getElementById('recolection-observations').value = recoleccion.observaciones;
    document.getElementById('recolection-status').value = recoleccion.transporte;

    // Limpiar filas anteriores
    const container1 = document.getElementById("recolection-products-container");
    const container2 = document.getElementById("recolected-products-container");
    container1.innerHTML = '';
    container2.innerHTML = '';

    const productos = await getRecolectionProducts(recoleccion.id_recoleccion);

    for (const producto of productos) {
        await viewProductRow("recolection", producto.id_producto, producto.codigo, producto.producto, producto.cantidad_recoleccion ?? 0,);
        await viewProductRow("recolected", producto.id_producto, producto.codigo, producto.producto, producto.cantidad_recolectada ?? 0,);
    };
}