import supabase from "../supabase/supabase-client.js";

// Función para calcular y asignar semana y año
export function getWeekAndYear(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7; // lunes=1, domingo=7

    d.setUTCDate(d.getUTCDate() + 4 - dayNum);

    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    
    return { semana: week, anio: d.getUTCFullYear() };
}

// Función para obtener la última semana registrada de conteos
export async function obtainCurrentWeek() {
    const { anio, semana } = getWeekAndYear()

    const { data, error } = await supabase
        .from('emb_partidas')
        .select('anio, semana')
        .eq('anio', anio)
        .eq('semana', semana)
        .limit(1);

    if (error) {
        console.error('Error obteniendo semana actual:', error);
        return null;
    }

    return data?.[0] || null;
}