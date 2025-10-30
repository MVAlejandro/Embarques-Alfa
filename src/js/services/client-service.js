import supabase from '../supabase/supabase-client.js'

// Función para insertar nuevos clientes
export async function createClient(clientData) {
    const { data, error } = await supabase
        .from('clientes')
        .insert([clientData]);

    if (error) {
        console.error(error);
        throw error;
    } 
}

// Función para obtener clientes
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

// Función para editar clientes de la base
export async function updateClient(id_cliente, updatedData) {
    const { data, error } = await supabase
        .from('clientes')
        .update(updatedData)
        .eq('id_cliente', id_cliente);

    if (error) {
        console.error('Error al actualizar:', error);
        alert('Error al actualizar el cliente: ' + error.message);
    }
}

// Función para eliminar clientes de la base
export async function deleteClient(idClient) {
    if (!idClient) {
        alert('No se pudo obtener el ID del cliente a eliminar.');
        return;
    }

    const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id_cliente', idClient);

    if (error) {
        console.error('Error eliminando cliente:', error);
        alert('Ocurrió un error al eliminar el cliente.');
        return;
    }
};