import supabase from '../supabase/supabase-client.js'

// UNIDADES
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
        alert('No se pudo obtener el ID de la unidad a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_unidades')
        .delete()
        .eq('id_unidad', idUnit);

    if (error) {
        console.error('Error eliminando unidad:', error);
        alert('Ocurrió un error al eliminar la unidad.');
        return;
    }
};


// ---------- CAJAS ---------- //

// Función para insertar nuevas unidades
export async function createBox(boxData) {
    const { data, error } = await supabase
        .from('emb_cajas')
        .insert([boxData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener unidades
export async function getBoxes() {
    const { data, error } = await supabase
        .from('emb_cajas')
        .select("*");
    
    if (error) {
        console.error('Error obteniendo cajas:', error);
        throw error;
    }
    
    return data.map(caja => ({
        id_caja: caja.id_caja,
        nombre: caja.nombre,
        descripcion: caja.descripcion
    }));
}

// Función para editar unidades de la base
export async function updateBox(id_caja, updatedData) {
    const { data, error } = await supabase
        .from('emb_cajas')
        .update(updatedData)
        .eq('id_caja', id_caja);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la caja: ' + error.message);
    }
}

// Función para eliminar unidades de la base
export async function deleteBox(idBox) {
    if (!idBox) {
        alert('No se pudo obtener el ID de la caja a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_cajas')
        .delete()
        .eq('id_caja', idBox);

    if (error) {
        console.error('Error eliminando caja:', error);
        alert('Ocurrió un error al eliminar la caja.');
        return;
    }
};