import supabase from '../supabase/supabase-client.js'

// Función para obtener partidas
export async function getPartitionProducts(idPartition) {
    const { data, error } = await supabase
        .from('emb_partida_producto')
        .select(`
            id_partida_producto,
            id_partida,
            cantidad_solicitada,
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
        .eq('id_partida', idPartition);

    if (error) {
        console.error('Error obteniendo partidas:', error);
        throw error;
    }

    return data.map(partidaP => ({
        id_partida_producto: partidaP.id_partida_producto,
        id_partida: partidaP.id_partida,
        cantidad_solicitada: partidaP.cantidad_solicitada,
        id_orden_producto: partidaP.id_orden_producto,
        cantidad_orden: partidaP.emb_orden_producto?.cantidad_orden,
        id_producto: partidaP.emb_orden_producto?.id_producto,
        codigo: partidaP.emb_orden_producto?.inv_productos?.codigo,
        producto: partidaP.emb_orden_producto?.inv_productos?.nombre
    }));
}

// Función para editar los productos asignados a la partida
export async function updatePartitionProducts(idPartition) {
    const productsItems = document.querySelectorAll('.product-item');

    for (const item of productsItems) {
        const amountInput = item.querySelector('.product-amount');
        const id_orden_producto = parseInt(item.dataset.idOrdenProducto);
        const cantidad_solicitada = parseInt(amountInput.value);

        if (isNaN(cantidad_solicitada) || cantidad_solicitada <= 0) {
            console.warn("Fila ignorada por cantidad inválida");
            continue;
        }

        // Intentar insertar y si ya existe actualizar
        const { data, error } = await supabase
            .from('emb_partida_producto')
            .upsert(
                {
                    id_partida: idPartition,
                    id_orden_producto,
                    cantidad_solicitada
                },
                { onConflict: ['id_partida', 'id_orden_producto'] }
            );

        if (error) {
            console.error('Error actualizando partida:', error);
            throw error;
        }
    }
}

// Función para obtener todas las partidas de una orden
export async function getAllPartitionProductsByOrder(idOrder) {
    const { data, error } = await supabase
        .from('emb_partida_producto')
        .select(`
            id_partida_producto,
            id_partida,
            id_orden_producto,
            cantidad_solicitada,
            emb_partidas ( id_orden )
        `)
        .eq('emb_partidas.id_orden', idOrder);

    if (error) {
        console.error("Error obteniendo partidas de la orden:", error);
        throw error;
    }

    return data;
}
