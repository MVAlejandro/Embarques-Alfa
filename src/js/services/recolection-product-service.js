import supabase from '../supabase/supabase-client.js'

// Función para obtener recoleccions
export async function getRecolectionProducts(idRecolection) {
    const { data, error } = await supabase
        .from('emb_recoleccion_producto')
        .select(`
            id_recoleccion_producto,
            id_recoleccion,
            cantidad_recoleccion,
            cantidad_recolectada,
            id_producto,
            inv_productos (codigo, nombre)
            `)
        .eq('id_recoleccion', idRecolection);

    if (error) {
        console.error('Error obteniendo recolecciones:', error);
        throw error;
    }

    return data.map(recoleccionP => ({
        id_recoleccion_producto: recoleccionP.id_recoleccion_producto,
        id_recoleccion: recoleccionP.id_recoleccion,
        cantidad_recoleccion: recoleccionP.cantidad_recoleccion,
        cantidad_recolectada: recoleccionP.cantidad_recolectada,
        id_producto: recoleccionP.id_producto,
        codigo: recoleccionP.inv_productos?.codigo,
        producto: recoleccionP.inv_productos?.nombre
    }));
}

// Función para editar los productos asignados a la recoleccion
export async function updateRecolectionProducts(idRecolection) {
    const productsItems = document.querySelectorAll('.recolectionProduct-item');

    for (const item of productsItems) {
        const select = item.querySelector('.product-select-code');
        const input = item.querySelector('.product-select-quantity');

        const id_producto = select?.value?.trim();
        const cantidad_recoleccion = parseFloat(input?.value);

        if (!id_producto || isNaN(cantidad_recoleccion) || cantidad_recoleccion <= 0) {
            console.warn("Fila ignorada por datos inválidos");
            continue;
        }

        // Intentar insertar y si ya existe actualizar
        const { data, error } = await supabase
            .from('emb_recoleccion_producto')
            .upsert(
                {
                    id_recoleccion: idRecolection,
                    id_producto,
                    cantidad_recoleccion
                },
                { onConflict: ['id_recoleccion', 'id_producto'] }
            );

        if (error) {
            console.error('Error actualizando recolección:', error);
            throw error;
        }
    }
}

// Función para editar los productos recolectados de la recolección
export async function updateRecolectedProducts(idRecolection) {
    const productsItems = document.querySelectorAll('.recolectedProduct-item');

    for (const item of productsItems) {
        const amountInput = item.querySelector('.product-input-quantity');
        const id_producto = parseInt(item.dataset.idProducto);
        const cantidad_recolectada = parseInt(amountInput.value);

        if (isNaN(cantidad_recolectada) || cantidad_recolectada <= 0) {
            console.warn("Fila ignorada por cantidad inválida");
            continue;
        }

        // Actualizar el registro con la cantidad recolectada
        const { data, error } = await supabase
            .from('emb_recoleccion_producto')
            .update({ cantidad_recolectada })
            .eq('id_recoleccion', idRecolection)
            .eq('id_producto', id_producto);

        if (error) {
            console.error('Error actualizando recolección:', error);
            throw error;
        }
    }
}