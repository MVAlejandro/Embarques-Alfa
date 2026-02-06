// Servicios Supabase
import { getPartitionProducts } from "../../services/partition-product-service";
// Utilidades
import { viewProductRow } from "../../utils/modal-product-rows";

// Función para cargar datos en el modal
export async function renderProductionModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('production-date').value = partida.fecha_programada;
    document.getElementById('production-oc').value = partida.numero_orden;
    document.getElementById('production-contract').value = partida.numero_contrato;
    document.getElementById('production-status').value = partida.planta;
    document.getElementById('production-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('production-observations').value = partida.observaciones;

    // Limpiar filas anteriores
    const container1 = document.getElementById("partition-products-container");
    const container2 = document.getElementById("production-products-container");
    container1.innerHTML = '';
    container2.innerHTML = '';

    const productos = await getPartitionProducts(partida.id_partida);

    for (const producto of productos) {
        await viewProductRow("partition", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_solicitada ?? 0,);
        await viewProductRow("production", producto.id_orden_producto, producto.codigo, producto.producto, producto.cantidad_producida ?? 0,);
    };
}

// Función para cargar datos de transporte en el modal
export async function renderTransportModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('transport-date').value = partida.fecha_programada;
    document.getElementById('transport-time').value = partida.hora_programada.slice(0, 5);
    document.getElementById('transport-oc').value = partida.numero_orden;
    document.getElementById('transport-operator').value = partida.operador || "-";
    document.getElementById('transport-status').value = partida.transporte;
    document.getElementById('transport-unit').value = partida.unidad || "-";
    document.getElementById('transport-box').value = partida.caja || "-";
    document.getElementById('transport-distance').value = partida.distancia != null ? partida.distancia.toLocaleString('en-US') + " Km" : "-";
    document.getElementById('transport-fuel').value = partida.combustible != null ? partida.combustible.toLocaleString('en-US') + " Lts" : "-";
    document.getElementById('transport-price').value = partida.costo != null ? "$" + partida.costo.toLocaleString('en-US'): "-";
    document.getElementById('transport-tag').value = partida.tag != null ? "$" + partida.tag.toLocaleString('en-US'): "-";
}

// Función para cargar datos de embarques en el modal
export async function renderShipmentsModal(partida) {
    // Insertar valores en los inputs
    document.getElementById('shipment-date').value = partida.fecha_programada;
    document.getElementById('shipment-time').value = partida.hora_programada.slice(0, 5);
    document.getElementById('shipment-real-time').value = partida.hora_realizada != null ? partida.hora_realizada.slice(0, 5) : "-";
    document.getElementById('shipment-oc').value = partida.numero_orden;
    document.getElementById('shipment-status').value = partida.embarque;
    document.getElementById('shipment-remision').value = partida.numero_remision || "-";
    document.getElementById('shipment-destination').value = partida.destino || partida.ubicacion;
    document.getElementById('shipment-observations').value = partida.observaciones;
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