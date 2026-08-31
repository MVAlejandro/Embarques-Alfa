import supabase from '../supabase/supabase-client.js'

// Función para obtener rechazos
export async function getRejectionProducts(idRejection) {
    const { data, error } = await supabase
        .from('emb_rechazo_producto')
        .select(`
            id_rechazo_producto,
            id_rechazo,
            cantidad_rechazada,
            id_orden_producto,
            emb_orden_producto (
                cantidad_orden,
                id_producto,
                inv_productos (
                    codigo,
                    nombre
                )
            )
            `)
        .eq('id_rechazo', idRejection);

    if (error) {
        console.error('Error obteniendo productos del rechazo:', error);
        throw error;
    }

    return data.map(rechazoP => ({
        id_rechazo_producto: rechazoP.id_rechazo_producto,
        id_rechazo: rechazoP.id_rechazo,
        cantidad_rechazada: rechazoP.cantidad_rechazada,
        id_orden_producto: rechazoP.id_orden_producto,
        cantidad_orden: rechazoP.emb_orden_producto?.cantidad_orden,
        id_producto: rechazoP.emb_orden_producto?.id_producto,
        codigo: rechazoP.emb_orden_producto?.inv_productos?.codigo,
        producto: rechazoP.emb_orden_producto?.inv_productos?.nombre
    }));
}

// Función para editar los productos asignados al rechazo
export async function updateRejectionProducts(idRejection) {
    const productsItems = document.querySelectorAll('.rejectionProduct-item');

    for (const item of productsItems) {
        const amountInput = item.querySelector('.product-input-quantity');
        const id_orden_producto = parseInt(item.dataset.idProducto);
        const cantidad_rechazada = parseInt(amountInput.value);

        if (isNaN(cantidad_rechazada) || cantidad_rechazada <= 0) {
            console.warn("Fila ignorada por cantidad inválida");
            continue;
        }

        // Intentar insertar y si ya existe actualizar
        const { data, error } = await supabase
            .from('emb_rechazo_producto')
            .upsert(
                {
                    id_rechazo: idRejection,
                    id_orden_producto,
                    cantidad_rechazada
                },
                { onConflict: ['id_rechazo', 'id_orden_producto'] }
            );

        if (error) {
            console.error('Error actualizando rechazo:', error);
            throw error;
        }
    }
}