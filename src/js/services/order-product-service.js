import supabase from '../supabase/supabase-client.js'

// Función para obtener órdenes
export async function getOrderProducts(idOrder) {
    const { data, error } = await supabase
        .from('emb_orden_producto')
        .select(`
            id_orden_producto,
            id_orden,
            cantidad,
            id_producto,
            inv_productos (codigo, nombre)
            `)
        .eq('id_orden', idOrder);
    
    if (error) {
        console.error('Error obteniendo órdenes:', error);
        throw error;
    }
    
    return data.map(ordenP => ({
        id_orden_producto: ordenP.id_orden_producto,
        id_orden: ordenP.id_orden,
        cantidad: ordenP.cantidad,
        id_producto: ordenP.id_producto,
        codigo: ordenP.inv_productos?.codigo,
        producto: ordenP.inv_productos?.nombre
    }));
}

// Función para asignar los productos a la orden
export async function addOrderProducts(idOrder) {
    const productsItems = document.querySelectorAll('.product-item');
    const productsData = [];

    // Obtener los productos válidos
    for (const item of productsItems) {
        const select = item.querySelector('.product-select');
        const input = item.querySelector('.product-input');

        const id_producto = select?.value?.trim();
        const cantidad = parseFloat(input?.value);

        if (!id_producto || isNaN(cantidad) || cantidad <= 0) {
            console.warn("Fila ignorada por datos inválidos");
            continue;
        }

        productsData.push({
            id_orden: idOrder,
            id_producto,
            cantidad
        });
    }

    // Primero eliminar productos existentes de la orden
    const { error: deleteError } = await supabase
        .from('emb_orden_producto')
        .delete()
        .eq('id_orden', idOrder);

    if (deleteError) throw deleteError;

    if (productsData.length === 0) {
        console.warn("No hay productos para insertar");
        return;
    }

    // Luego insertar productos nuevos
    const { data, error: insertError } = await supabase
        .from('emb_orden_producto')
        .insert(productsData)

    if (insertError) throw insertError;
}

// Función para obtener productos
export async function getProducts() {
    const { data, error } = await supabase
        .from('inv_productos')
        .select(`
            id_producto,
            codigo,
            nombre,
            fecha_creacion,
            descripcion,
            id_almacen,
            inv_almacenes(nombre)
        `);
    
    if (error) {
        console.error('Error obteniendo productos:', error);
        throw error;
    }
    
    return data.map(producto => ({
        id_producto: producto.id_producto,
        codigo: producto.codigo,
        nombre: producto.nombre,
        fecha_creacion: producto.fecha_creacion,
        descripcion: producto.descripcion,
        id_almacen: producto.id_almacen,
        almacen: producto.inv_almacenes?.nombre
    }));
}
