import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas unidades
export async function createUnit(unitData) {
    const { data, error } = await supabase
        .from('emb_unidades')
        .insert([unitData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener unidades
export async function getUnits() {
    const { data, error } = await supabase
        .from('emb_unidades')
        .select("*");
    
    if (error) {
        console.error('Error obteniendo unidades:', error);
        throw error;
    }
    
    return data.map(unidad => ({
        id_unidad: unidad.id_unidad,
        nombre: unidad.nombre,
        tipo: unidad.tipo,
        descripcion: unidad.descripcion
    }));
}

// Función para editar unidades de la base
export async function updateUnit(id_unidad, updatedData) {
    const { data, error } = await supabase
        .from('emb_unidades')
        .update(updatedData)
        .eq('id_unidad', id_unidad);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el unidad: ' + error.message);
    }
}

// Función para eliminar unidades de la base
export async function deleteUnit(idUnit) {
    if (!idUnit) {
        alert('No se pudo obtener el ID del unidad a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_unidades')
        .delete()
        .eq('id_unidad', idUnit);

    if (error) {
        console.error('Error eliminando unidad:', error);
        alert('Ocurrió un error al eliminar el unidad.');
        return;
    }
};