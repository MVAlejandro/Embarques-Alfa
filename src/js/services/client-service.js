import supabase from '../supabase/supabase-client.js'

// Función centralizada para obtener clientes
export async function getClients() {
    const { data, error } = await supabase
        .from('clientes')
        .select("*");
    
    if (error) {
        console.error('Error obteniendo clientes:', error);
        throw error;
    }
    
    return data.map(cliente => ({
        id_cliente: cliente.id_cliente,
        razon_social: cliente.razon_social,
        rfc: cliente.rfc,
        nombre: cliente.nombre,
        codigo_postal: cliente.codigo_postal,
        ubicacion: cliente.ubicacion,
        numero_telefono: cliente.numero_telefono,
        correo: cliente.correo
    }));
}