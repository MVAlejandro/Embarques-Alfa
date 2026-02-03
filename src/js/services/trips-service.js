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
            emb_operadores (nombre)
            `);
    
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