import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas recolecciones
export async function createRecolection(recolectionData) {
    const { data, error } = await supabase
        .from('emb_recolecciones')
        .insert([recolectionData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener recolecciones
export async function getRecolections() {
    const { data, error } = await supabase
        .from('emb_recolecciones')
        .select(`
            id_recoleccion,
            fecha_programada,
            semana,
            anio,
            hora_programada,
            hora_recolectada,
            transporte,
            numero_remision,
            numero_facturacion,
            destino,
            observaciones,
            id_proveedor,
            emb_proveedores (
                nombre,
                correo,
                ubicacion
            ),
            id_viaje
            `)
        .order('fecha_programada', { ascending: true })
        .order('hora_programada', { ascending: true });
    
    if (error) {
        console.error('Error obteniendo recolecciones:', error);
        throw error;
    }
    
    return data.map(recoleccion => ({
        id_recoleccion: recoleccion.id_recoleccion,
        fecha_programada: recoleccion.fecha_programada,
        semana: recoleccion.semana,
        anio: recoleccion.anio,
        hora_programada: recoleccion.hora_programada,
        hora_recolectada: recoleccion.hora_recolectada,
        transporte: recoleccion.transporte,
        numero_remision: recoleccion.numero_remision,
        numero_facturacion: recoleccion.numero_facturacion,
        destino: recoleccion.destino,
        observaciones: recoleccion.observaciones,
        id_proveedor: recoleccion.id_proveedor,
        proveedor: recoleccion.emb_proveedores?.nombre,
        correo: recoleccion.emb_proveedores?.correo,
        ubicacion: recoleccion.emb_proveedores?.ubicacion,
        id_viaje: recoleccion.id_viaje
    }));
}

// Función para editar recolecciones de la base
export async function updateRecolection(id_recoleccion, updatedData) {
    const { data, error } = await supabase
        .from('emb_recolecciones')
        .update(updatedData)
        .eq('id_recoleccion', id_recoleccion);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la recolección: ' + error.message);
    }
}

// Función para eliminar recolecciones de la base
export async function deleteRecolection(idRecolection) {
    if (!idRecolection) {
        alert('No se pudo obtener el ID de la recolección a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_recolecciones')
        .delete()
        .eq('id_recoleccion', idRecolection);

    if (error) {
        console.error('Error eliminando recolección:', error);
        alert('Ocurrió un error al eliminar la recolección.');
        return;
    }
};