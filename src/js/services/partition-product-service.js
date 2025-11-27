import supabase from '../supabase/supabase-client.js'

// Función para obtener partidas
export async function getPartitionProducts(idPartition) {
    const { data, error } = await supabase
        .from('emb_partida_producto')
        .select(`
            id_partida_producto,
            id_partida,
            cantidad_partida,
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
        cantidad_partida: partidaP.cantidad_partida,
        id_orden_producto: partidaP.id_orden_producto,
        cantidad_orden: partidaP.emb_orden_producto?.cantidad_orden,
        id_producto: partidaP.emb_orden_producto?.id_producto,
        codigo: partidaP.emb_orden_producto?.inv_productos?.codigo,
        producto: partidaP.emb_orden_producto?.inv_productos?.nombre
    }));
}

// Función para asignar los productos a la partida
export async function addPartitionProducts(idPartition) {
    const productsItems = document.querySelectorAll('.product-item');
    const productsData = [];

    // Obtener los productos válidos
    for (const item of productsItems) {
        const amountInput = item.querySelector('.product-amount');
        
        const id_orden_producto = parseInt(item.dataset.idOrdenProducto);
        const cantidad_partida = parseInt(amountInput.value);

        if (isNaN(cantidad_partida) || cantidad_partida <= 0) {
            console.warn("Fila ignorada por cantidad inválida");
            continue;
        }

        productsData.push({
            id_partida: idPartition,
            id_orden_producto,
            cantidad_partida
        });
    }

    // Primero eliminar productos existentes de la partida
    const { error: deleteError } = await supabase
        .from('emb_partida_producto')
        .delete()
        .eq('id_partida', idPartition);

    if (deleteError) throw deleteError;

    if (productsData.length === 0) {
        console.warn("No hay productos para insertar en la partida");
        return;
    }

    // Insertar los productos en la partida
    const { data, error: insertError } = await supabase
        .from('emb_partida_producto')
        .insert(productsData);

    if (insertError) throw insertError;
}

// Función para obtener todas las partidas de una orden
export async function getAllPartitionProductsByOrder(idOrder) {
    const { data, error } = await supabase
        .from('emb_partida_producto')
        .select(`
            id_partida_producto,
            id_partida,
            id_orden_producto,
            cantidad_partida,
            emb_partidas ( id_orden )
        `)
        .eq('emb_partidas.id_orden', idOrder);

    if (error) {
        console.error("Error obteniendo partidas de la orden:", error);
        throw error;
    }

    return data;
}
