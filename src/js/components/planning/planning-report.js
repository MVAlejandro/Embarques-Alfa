
export async function planningReport(allTrips) {
    console.log(allTrips);
    
    // Obtener tipo de reporte por el radio seleccionado
    let excelTrips = [];
    let excelPartitions = [];
    let excelRecolections = [];

    // Determinar la información del reporte a generar
    excelTrips = allTrips.map(t => ({
        "ID": t.id_viaje,
        "Fecha": t.fecha_programada,
        "H Programada": t.hora_programada,
        "H Salida": t.hora_salida || "Sin Registro",
        "Tipo": t.tipo,
        "Unidad": t.unidad,
        "Placas": t.placas,
        "Caja": t.caja,
        "Operador": t.operador,
        "Estado": t.estado,
        "Dist (Km)": t.distancia || "Sin Registro",
        "Comb (Lts)": t.combustible || "Sin Registro",
        "Costo ($)": t.costo || "Sin Registro",
        "TAG ($)": t.tag || "Sin Registro",
        "Observaciones": t.observaciones
    }));

    excelPartitions = allTrips.flatMap(t =>
        t.partidas.map(p => ({
            "Fecha": p.fecha_programada,
            "H Programada": p.hora_programada,
            "H Embarque": p.hora_embarcada || "Sin Registro",
            "Viaje": p.id_viaje,
            "Cliente": p.cliente,
            "Destino": p.destino,
            "OC": p.numero_orden,
            "Contrato": p.numero_contrato,
            "Resmisión": p.numero_remision || "Sin Registro",
            "Factura": p.numero_facturacion || "Sin Registro",
            "Productos": p.productos.map(prod => `${prod.emb_orden_producto.inv_productos.nombre} (${prod.cantidad_solicitada ?? 0})`)
                .join(", ")
        }))
    );

    excelRecolections = allTrips.flatMap(t =>
        t.recolecciones.map(r => ({
            "Fecha": r.fecha_programada,
            "H Programada": r.hora_programada,
            "H Recolección": r.hora_recolectada || "Sin Registro",
            "Viaje": r.id_viaje,
            "Proveedor": r.proveedor,
            "Destino": r.destino || "Sin Registro",
            "OC": r.numero_orden || "Sin Registro",
            "Resmisión": r.numero_remision || "Sin Registro",
            "Productos": r.productos.map(prod => `${prod.inv_productos.nombre} (${prod.cantidad_recoleccion ?? 0})`)
                .join(", ")
        }))
    );

    if (!excelTrips.length) {
        Swal.fire({
            title: 'Atención',
            text: 'No hay datos para exportar.',
            icon: 'warning',
            confirmButtonText: 'OK'
        });
        return;
    }

    const wsTrips = XLSX.utils.json_to_sheet(excelTrips);
    const wsPartitions = XLSX.utils.json_to_sheet(excelPartitions);
    const wsRecolections = XLSX.utils.json_to_sheet(excelRecolections);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, wsTrips, "Viajes");
    XLSX.utils.book_append_sheet(wb, wsPartitions, "Partidas");
    XLSX.utils.book_append_sheet(wb, wsRecolections, "Recolecciones");

    XLSX.writeFile(wb, `reporte_viajes_${allTrips[0].fecha_programada}.xlsx`);
}