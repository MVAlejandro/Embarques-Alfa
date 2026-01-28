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
            hora_realizada,
            transporte,
            distancia,
            combustible,
            costo,
            tag,
            numero_remision,
            numero_facturacion,
            destino,
            observaciones,
            id_unidad,
            emb_unidades (nombre, placas),
            id_caja,
            emb_cajas (nombre),
            id_operador,
            emb_operadores (nombre),
            id_proveedor,
            emb_proveedores (
                nombre,
                correo,
                ubicacion
            )
            `);
    
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
        hora_realizada: recoleccion.hora_realizada,
        facturacion: recoleccion.facturacion,
        embarque: recoleccion.embarque,
        planta: recoleccion.planta,
        transporte: recoleccion.transporte,
        distancia: recoleccion.distancia,
        combustible: recoleccion.combustible,
        costo: recoleccion.costo,
        tag: recoleccion.tag,
        numero_remision: recoleccion.numero_remision,
        numero_facturacion: recoleccion.numero_facturacion,
        destino: recoleccion.destino,
        observaciones: recoleccion.observaciones,
        id_unidad: recoleccion.id_unidad,
        unidad: recoleccion.emb_unidades?.nombre,
        placas: recoleccion.emb_unidades?.placas,
        id_caja: recoleccion.id_caja,
        caja: recoleccion.emb_cajas?.nombre,
        id_operador: recoleccion.id_operador,
        operador: recoleccion.emb_operadores?.nombre,
        id_proveedor: recoleccion.id_proveedor,
        proveedor: recoleccion.emb_proveedores?.nombre,
        correo: recoleccion.emb_proveedores?.correo,
        ubicacion: recoleccion.emb_proveedores?.ubicacion
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