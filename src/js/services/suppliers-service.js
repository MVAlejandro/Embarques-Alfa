import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos proveedores
export async function createSupplier(supplierData) {
    const { data, error } = await supabase
        .from('emb_proveedores')
        .insert([supplierData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener proveedores
export async function getSuppliers() {
    const { data, error } = await supabase
        .from('emb_proveedores')
        .select("*");
    
    if (error) {
        console.error('Error obteniendo proveedores:', error);
        throw error;
    }
    
    return data.map(proveedor => ({
        id_proveedor: proveedor.id_proveedor,
        razon_social: proveedor.razon_social,
        rfc: proveedor.rfc,
        nombre: proveedor.nombre,
        codigo_postal: proveedor.codigo_postal,
        ubicacion: proveedor.ubicacion,
        numero_telefono: proveedor.numero_telefono,
        correo: proveedor.correo
    }));
}

// Función para editar proveedores de la base
export async function updateSupplier(id_proveedor, updatedData) {
    const { data, error } = await supabase
        .from('emb_proveedores')
        .update(updatedData)
        .eq('id_proveedor', id_proveedor);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el proveedor: ' + error.message);
    }
}

// Función para eliminar proveedores de la base
export async function deleteSupplier(idSupplier) {
    if (!idSupplier) {
        alert('No se pudo obtener el ID del proveedor a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_proveedores')
        .delete()
        .eq('id_proveedor', idSupplier);

    if (error) {
        console.error('Error eliminando proveedor:', error);
        alert('Ocurrió un error al eliminar el proveedor.');
        return;
    }
};