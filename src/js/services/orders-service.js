import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevas órdenes
export async function createOrder(orderData) {
    const { data, error } = await supabase
        .from('emb_ordenes_compra')
        .insert([orderData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener órdenes
export async function getOrders() {
    const { data, error } = await supabase
        .from('emb_ordenes_compra')
        .select(`
            id_orden,
            numero_orden,
            numero_contrato,
            fecha,
            semana,
            anio,
            estado,
            id_cliente,
            emb_clientes (nombre, correo)
            `);
    
    if (error) {
        console.error('Error obteniendo órdenes:', error);
        throw error;
    }
    
    return data.map(orden => ({
        id_orden: orden.id_orden,
        numero_orden: orden.numero_orden,
        numero_contrato: orden.numero_contrato,
        fecha: orden.fecha,
        semana: orden.semana,
        anio: orden.anio,
        estado: orden.estado,
        id_cliente: orden.id_cliente,
        cliente: orden.emb_clientes?.nombre,
        correo: orden.emb_clientes?.correo
    }));
}

// Función para obtener órdenes activas
export async function getActiveOrders() {
    const { data, error } = await supabase
        .from('emb_ordenes_compra')
        .select(`
            id_orden,
            numero_orden,
            numero_contrato,
            estado,
            id_cliente,
            emb_clientes (nombre)
            `)
        .eq('estado', 'Vigente');
    
    if (error) {
        console.error('Error obteniendo órdenes activas:', error);
        throw error;
    }
    
    return data.map(orden => ({
        id_orden: orden.id_orden,
        numero_orden: orden.numero_orden,
        numero_contrato: orden.numero_contrato,
        estado: orden.estado,
        id_cliente: orden.id_cliente,
        cliente: orden.emb_clientes?.nombre
    }));
}

// Función para editar órdenes de la base
export async function updateOrder(id_orden, updatedData) {
    const { data, error } = await supabase
        .from('emb_ordenes_compra')
        .update(updatedData)
        .eq('id_orden', id_orden);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar la orden: ' + error.message);
    }
}

// Función para eliminar órdenes de la base
export async function deleteOrder(idOrder) {
    if (!idOrder) {
        alert('No se pudo obtener el ID de la orden de compra a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('emb_ordenes_compra')
        .delete()
        .eq('id_orden', idOrder);

    if (error) {
        console.error('Error eliminando orden:', error);
        alert('Ocurrió un error al eliminar la orden de compra.');
        return;
    }
};
