// Servicios Supabase
import { getPartitionProducts } from "../../services/partition-product-service";

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
    const container = document.getElementById("partition-products-container");
    container.innerHTML = '';
    const productos = await getPartitionProducts(partida.id_partida);

    for (const producto of productos) {
        const index = container.children.length;
        const uniqueId = `product-${index}`;
        const newProduct = document.createElement("div");
        newProduct.className = "row ms-2 me-2 pt-2 pb-2 product-item";
        newProduct.innerHTML += 
        `<div class="col-7">
        <input type="text" id="${uniqueId}-producto" class="form-control" value="${producto.codigo} - ${producto.producto}" disabled>
        </div>
        <div class="col-5">
            <input type="number" id="${uniqueId}-cantidad" class="form-control" value="${producto.cantidad_solicitada}" disabled>
        </div>`;
        container.appendChild(newProduct);
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
    document.getElementById('shipment-real-time').value = partida.hora_realizada.slice(0, 5) || "-";
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