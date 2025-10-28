import supabase from '../../supabase/supabase-client.js'
import { getClients } from '../../services/client-service.js';

// Función para cargar datos en el modal
export async function renderClientsEditModal(cliente) {
    // Insertar valores en los inputs
    document.getElementById('edit-id-cliente').value = cliente.id_cliente;
    document.getElementById('edit-nombre').value = cliente.nombre;
    document.getElementById('edit-razon').value = cliente.razon_social;
    document.getElementById('edit-rfc').value = cliente.rfc;
    document.getElementById('edit-telefono').value = cliente.numero_telefono;
    document.getElementById('edit-correo').value = cliente.correo;
    document.getElementById('edit-cp').value = cliente.codigo_postal;
    document.getElementById('edit-ubicacion').value = cliente.ubicacion;
}