import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas partidas
export async function createPartition(partitionData) {
    const { data, error } = await supabase
        .from('emb_partidas')
        .insert([partitionData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener partidas
export async function getPartitions() {
    const { data, error } = await supabase
        .from('emb_partidas')
        .select(`
            id_partida,
            fecha_programada,
            semana,
            anio,
            hora_programada,
            hora_realizada,
            facturacion,
            embarque,
            planta,
            transporte,
            observaciones,
            id_unidad,
            emb_unidades (nombre, placas),
            id_caja,
            emb_cajas (nombre),
            id_orden,
            emb_ordenes_compra (
                numero_orden,
                numero_contrato,
                id_cliente,
                emb_clientes (nombre, correo)
            )
            `);
    
    if (error) {
        console.error('Error obteniendo partidas:', error);
        throw error;
    }
    
    return data.map(partida => ({
        id_partida: partida.id_partida,
        fecha_programada: partida.fecha_programada,
        semana: partida.semana,
        anio: partida.anio,
        hora_programada: partida.hora_programada,
        hora_realizada: partida.hora_realizada,
        facturacion: partida.facturacion,
        embarque: partida.embarque,
        planta: partida.planta,
        transporte: partida.transporte,
        observaciones: partida.observaciones,
        id_unidad: partida.id_unidad,
        unidad: partida.emb_unidades?.nombre,
        placas: partida.emb_unidades?.placas,
        id_caja: partida.id_caja,
        caja: partida.emb_cajas?.nombre,
        id_orden: partida.id_orden,
        numero_orden: partida.emb_ordenes_compra?.numero_orden,
        numero_contrato: partida.emb_ordenes_compra?.numero_contrato,
        id_cliente: partida.emb_ordenes_compra?.id_cliente,
        cliente: partida.emb_ordenes_compra?.emb_clientes?.nombre,
        correo: partida.emb_ordenes_compra?.emb_clientes?.correo
    }));
}

// Función para editar partidas de la base
export async function updatePartition(id_partida, updatedData) {
    const { data, error } = await supabase
        .from('emb_partidas')
        .update(updatedData)
        .eq('id_partida', id_partida);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la partida: ' + error.message);
    }
}

// Función para eliminar partidas de la base
export async function deletePartition(idPartition) {
    if (!idPartition) {
        alert('No se pudo obtener el ID de la partida a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_partidas')
        .delete()
        .eq('id_partida', idPartition);

    if (error) {
        console.error('Error eliminando partida:', error);
        alert('Ocurrió un error al eliminar la partida.');
        return;
    }
};