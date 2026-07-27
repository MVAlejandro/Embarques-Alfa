// Servicios Supabase
import { updatePartition } from "../../services/partitions-service";
import { shipmentsFilter } from "./shipments-filter";

export async function saveShipmentsOrder() {
    const rows = document.querySelectorAll('#shipments-table tbody tr[data-id]');

    const newOrder = [...rows].map((fila, index) => ({
        id_partida: Number(fila.dataset.id),
        orden_embarque: index + 1
    }));

    let orderedPartitions = 0;

    for (let order of newOrder) {
        try {
            await updatePartition(order.id_partida, {orden_embarque: order.orden_embarque});
            orderedPartitions++;
        } catch (err) {
            console.error('Error al ordenar la partida:', order, err);
            Swal.fire({
                title: 'Oops...',
                text: 'Ocurrió un error al ordenar la partida.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }

    Swal.fire({
        title: 'Partidas ordenadas con éxito.',
        text: `Se planearon ${orderedPartitions} partidas.`,
        icon: 'success',
        confirmButtonText: 'OK'
    });

    // Recarga la tabla con los datos actualizados
    await shipmentsFilter();
}