import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos viajes
export async function createTrip(tripData) {
    const { data, error } = await supabase
        .from('emb_viajes')
        .insert([tripData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener viajes
export async function getTrips() {
    const { data, error } = await supabase
        .from('emb_viajes')
        .select(`
        id_viaje,
        fecha_programada,
        semana,
        anio,
        hora_programada,
        hora_salida,
        tipo,
        estado,
        distancia,
        combustible,
        costo,
        tag,

        id_unidad,
        emb_unidades (nombre, placas),

        id_caja,
        emb_cajas (nombre),

        id_operador,
        emb_operadores (nombre),

        emb_partidas (
            id_partida,
            transporte,
            emb_ordenes_compra (
                emb_clientes (nombre, ubicacion)
            ),
            
            emb_partida_producto (
                cantidad_solicitada,
                cantidad_producida
            )
        ),

        emb_recolecciones (
            id_recoleccion,
            transporte,
            emb_proveedores (nombre, ubicacion),

            emb_recoleccion_producto (
                cantidad_recoleccion
            )
        )
        `)
        .order('fecha_programada', { ascending: true })
        .order('hora_programada', { ascending: true });

    if (error) {
        console.error('Error obteniendo viajes:', error);
        throw error;
    }

    return data.map(viaje => ({
        id_viaje: viaje.id_viaje,
        fecha_programada: viaje.fecha_programada,
        semana: viaje.semana,
        anio: viaje.anio,
        hora_programada: viaje.hora_programada,
        hora_salida: viaje.hora_salida,
        tipo: viaje.tipo,
        estado: viaje.estado,
        distancia: viaje.distancia,
        combustible: viaje.combustible,
        costo: viaje.costo,
        tag: viaje.tag,

        id_unidad: viaje.id_unidad,
        unidad: viaje.emb_unidades?.nombre,
        placas: viaje.emb_unidades?.placas,

        id_caja: viaje.id_caja,
        caja: viaje.emb_cajas?.nombre,
        
        id_operador: viaje.id_operador,
        operador: viaje.emb_operadores?.nombre,

        partidas: viaje.emb_partidas?.map(p => ({
            id_partida: p.id_partida,
            transporte: p.transporte,
            cliente: p.emb_ordenes_compra?.emb_clientes?.nombre,
            ubicacion: p.emb_ordenes_compra?.emb_clientes?.ubicacion,
            productos: p.emb_partida_producto ?? []
        })) ?? [],

        recolecciones: viaje.emb_recolecciones?.map(r => ({
            id_recoleccion: r.id_recoleccion,
            transporte: r.transporte,
            proveedor: r.emb_proveedores?.nombre,
            ubicacion: r.emb_proveedores?.ubicacion,
            productos: r.emb_recoleccion_producto ?? []
        })) ?? []
    }));
}

// Función para obtener los viajes completos con sus eventos
export async function getFullTrips() {
    const { data, error } = await supabase
        .from('emb_viajes')
        .select(`
        id_viaje,
        fecha_programada,
        semana,
        anio,
        hora_programada,
        hora_salida,
        tipo,
        estado,
        distancia,
        combustible,
        costo,
        tag,

        emb_unidades (nombre, placas),
        emb_cajas (nombre),
        emb_operadores (nombre),

        emb_partidas (
            id_partida,
            fecha_programada,
            hora_programada,
            hora_realizada,
            semana,
            anio,
            facturacion,
            embarque,
            planta,
            transporte,
            numero_remision,
            numero_facturacion,
            destino,
            observaciones,

            emb_ordenes_compra (
                numero_orden,
                numero_contrato,
                emb_clientes (nombre, correo, ubicacion)
            ),

            emb_partida_producto (
                cantidad_solicitada,
                cantidad_producida,
                emb_orden_producto (
                    id_orden_producto,
                    cantidad,
                    inv_productos (nombre)
                )
            )
        ),

        emb_recolecciones (
            id_recoleccion,
            fecha_programada,
            hora_programada,
            hora_realizada,
            semana,
            anio,
            transporte,
            numero_remision,
            numero_facturacion,
            destino,
            observaciones,

            emb_proveedores (
                nombre,
                correo,
                ubicacion
            ),

            emb_recoleccion_producto (
                cantidad_recoleccion,
                inv_productos (nombre)
            )
        )
        `)
        .order('fecha_programada', { ascending: true })
        .order('hora_programada', { ascending: true });

    if (error) {
        console.error('Error obteniendo viajes completos:', error);
        throw error;
    }

    return data.map(viaje => ({
        id_viaje: viaje.id_viaje,
        fecha_programada: viaje.fecha_programada,
        semana: viaje.semana,
        anio: viaje.anio,
        hora_programada: viaje.hora_programada,
        hora_salida: viaje.hora_salida,
        tipo: viaje.tipo,
        estado: viaje.estado,
        distancia: viaje.distancia,
        combustible: viaje.combustible,
        costo: viaje.costo,
        tag: viaje.tag,

        unidad: viaje.emb_unidades?.nombre,
        placas: viaje.emb_unidades?.placas,
        caja: viaje.emb_cajas?.nombre,
        operador: viaje.emb_operadores?.nombre,

        partidas: viaje.emb_partidas ?? [],
        recolecciones: viaje.emb_recolecciones ?? []
    }));
}


// Función para editar viajes de la base
export async function updateTrip(id_viaje, updatedData) {
    const { data, error } = await supabase
        .from('emb_viajes')
        .update(updatedData)
        .eq('id_viaje', id_viaje);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el viaje: ' + error.message);
    }
}

// Función para eliminar viajes de la base
export async function deleteTrip(idTrip) {
    if (!idTrip) {
        alert('No se pudo obtener el ID del viaje a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_viajes')
        .delete()
        .eq('id_viaje', idTrip);

    if (error) {
        console.error('Error eliminando viaje:', error);
        alert('Ocurrió un error al eliminar el viaje.');
        return;
    }
};