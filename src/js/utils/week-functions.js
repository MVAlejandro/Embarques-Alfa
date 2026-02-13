import supabase from "../supabase/supabase-client.js";

// Función para obtener la última semana registrada de conteos
export async function obtainLastWeek() {
    const { data, error } = await supabase
        .from('emb_partidas')
        .select('semana, anio')
        .order('anio', { ascending: false })
        .order('semana', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error obteniendo última semana:', error);
        return null;
    }

    return data?.[0] || null;
}