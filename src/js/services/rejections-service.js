import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos rechazos
export async function createRejection(rejectionData) {
    const { data, error } = await supabase
        .from('emb_rechazos')
        .insert([rejectionData])
        .select('id_rechazo')
        .single();

    if (error) {
        console.error(error);
        throw error;
    } 

    return data.id_rechazo
}

// Función para obtener rechazos ordenados por fecha
export async function getRejections() {
    const { data, error } = await supabase
        .from('emb_rechazos')
        .select(`
            id_rechazo,
            fecha,
            fecha_rechazo,
            semana,
            anio,
            estado,
            observaciones,
            id_partida,
            emb_partidas (
                fecha_programada,
                numero_remision,
                numero_facturacion,
                id_orden,
                emb_ordenes_compra (
                    numero_orden,
                    numero_contrato,
                    id_cliente,
                    emb_clientes (nombre)
                )
            ),
            id_no_conformidad
            `)
        .order('fecha_rechazo', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo rechazos:', error);
        throw error;
    }
    
    return data.map(rechazo => ({
        id_rechazo: rechazo.id_rechazo,
        fecha: rechazo.fecha,
        fecha_rechazo: rechazo.fecha_rechazo,
        semana: rechazo.semana,
        anio: rechazo.anio,
        estado: rechazo.estado,
        observaciones: rechazo.observaciones,
        id_partida: rechazo.id_partida,
        fecha_programada: rechazo.emb_partidas?.fecha_programada,
        numero_remision: rechazo.emb_partidas?.numero_remision,
        numero_facturacion: rechazo.emb_partidas?.numero_facturacion,
        numero_orden: rechazo.emb_partidas?.emb_ordenes_compra?.numero_orden,
        numero_contrato: rechazo.emb_partidas?.emb_ordenes_compra?.numero_contrato,
        id_cliente: rechazo.emb_partidas?.emb_ordenes_compra?.id_cliente,
        cliente: rechazo.emb_partidas?.emb_ordenes_compra?.emb_clientes?.nombre,
        id_no_conformidad: rechazo.id_no_conformidad
    }));
}

// Función para obtener elrechazo de una partida especificada
export async function findRejection(id_partida) {
    const { data, error } = await supabase
        .from('emb_rechazos')
        .select(`
            id_rechazo,
            fecha,
            fecha_rechazo,
            semana,
            anio,
            estado,
            observaciones,
            id_partida,
            emb_partidas (
                fecha_programada,
                numero_remision,
                numero_facturacion,
                id_orden,
                emb_ordenes_compra (
                    numero_orden,
                    numero_contrato,
                    id_cliente,
                    emb_clientes (nombre)
                )
            ),
            id_no_conformidad
            `)
        .eq('id_partida', id_partida)
        .maybeSingle();
    
    if (error) {
        console.error('Error obteniendo rechazo:', error);
        throw error;
    }
    
    if (!data) {
        return null;
    }

    return {
        id_rechazo: data.id_rechazo,
        fecha: data.fecha,
        fecha_rechazo: data.fecha_rechazo,
        semana: data.semana,
        anio: data.anio,
        estado: data.estado,
        observaciones: data.observaciones,
        id_partida: data.id_partida,
        fecha_programada: data.emb_partidas?.fecha_programada,
        numero_remision: data.emb_partidas?.numero_remision,
        numero_facturacion: data.emb_partidas?.numero_facturacion,
        numero_orden: data.emb_partidas?.emb_ordenes_compra?.numero_orden,
        numero_contrato: data.emb_partidas?.emb_ordenes_compra?.numero_contrato,
        id_cliente: data.emb_partidas?.emb_ordenes_compra?.id_cliente,
        cliente: data.emb_partidas?.emb_ordenes_compra?.emb_clientes?.nombre,
        id_no_conformidad: data.id_no_conformidad
    };
}

// Función para editar rechazos de la base
export async function updateRejection(id_rechazo, updatedData) {
    const { data, error } = await supabase
        .from('emb_rechazos')
        .update(updatedData)
        .eq('id_rechazo', id_rechazo);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el rechazo: ' + error.message);
    }
}

// Función para eliminar rechazos de la base
export async function deleteRejection(idRejection) {
    if (!idRejection) {
        alert('No se pudo obtener el ID del rechazo a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_rechazos')
        .delete()
        .eq('id_rechazo', idRejection);

    if (error) {
        console.error('Error eliminando rechazo:', error);
        alert('Ocurrió un error al eliminar el rechazo.');
        return;
    }
};

// Función para obtener la no conformidad relacionada a una rechazo
export async function getRejectionPlan(planId) {
    const { data: no_conformidad, error } = await supabase
        .from('emb_no_conformidades')
        .select('*')
        .eq('id_no_conformidad', planId)
        .single();

    if (error) {
        console.error('Error obteniendo no conformidad:', error);
        throw error;
    }

    return no_conformidad;
}
