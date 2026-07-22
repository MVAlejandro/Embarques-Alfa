// Servicios Supabase
import { getPartitions } from "../../services/partitions-service"; 

let allPartitions = [];
// Función para crear el gráfico con porcentaje de cancelaciones
export async function renderCanceledGraphic(dates) {
    // Obtener todos los registros de partidas
    allPartitions = await getPartitions();
    
    // Usar solo entradas de la semana dada
    allPartitions = allPartitions.filter(p => p.semana == dates.semana && p.anio == dates.anio);

    const container = document.getElementById("graphic-canceled-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!allPartitions.length) {
        container.innerHTML = `<div class="alert alert-info">No hay partidas esta semana</div>`;
        return;
    }

    // Agrupar por día y tipo de partida
    const weekPartitions = {};

    allPartitions.forEach(p => {
        const date = p.fecha_programada.slice(5);;

        if (!weekPartitions[date]) {
            weekPartitions[date] = { total: 0, canceled: 0 };
        }

        weekPartitions[date].total++;

        if (p.planta === "Cancelado") {
            weekPartitions[date].canceled++;
        }
    });

    // Preparar labels y datos para gráfico
    const labels = Object.keys(weekPartitions);

    const percentagePerDay = labels.map(date => {
        const { total, canceled } = weekPartitions[date];
        return total > 0
            ? Number(((canceled / total) * 100).toFixed(2))
            : 0;
    });

    // Crear canvas
    container.innerHTML = `<canvas id="canceled-graphic"></canvas>`;
    const ctx = document.getElementById("canceled-graphic").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "% Cancelaciones por día",
                data: percentagePerDay,
                borderColor: "#E74C3C",
                backgroundColor: "rgba(231,76,60,0.2)",
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 80,
                    ticks: {
                        stepSize: 20
                    },
                    title: {
                        display: true,
                        text: "Cancelaciones (%)"
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: "Fecha"
                    }
                }
            },
            plugins: {
                datalabels: {
                    align: 'top',
                    anchor: 'end',
                    formatter: value => value + '%'
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y}%`
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

// Función para crear el gráfico por departamentos
export async function renderClientsGraphic(dates) {
    // Obtener todos los registros de partidas
    allPartitions = await getPartitions();
    
    // Usar solo entradas de la semana dada
    allPartitions = allPartitions.filter(p => p.semana == dates.semana && p.anio == dates.anio);
    
    const container = document.getElementById("graphic-client-container");
    // Limpiar antes de insertar
    container.innerHTML = "";

    if (!allPartitions.length) {
        container.innerHTML = `<div class="alert alert-info">No hay partidas esta semana</div>`;
        return;
    }

    // Agrupar partidas por cliente
    const clientPartitions = {};

    allPartitions.forEach(partition => {
        const client = partition.cliente;

        if (!clientPartitions[client]) {
            clientPartitions[client] = 0;
        }
        clientPartitions[client]++;
    });

    const labels = Object.keys(clientPartitions);
    const data = Object.values(clientPartitions);

    // Generar el gráfico con la información del reporte
    container.innerHTML = '<canvas id="client-graphic"></canvas>';
    const ctx = document.getElementById('client-graphic').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                label: 'Partidas por cliente',
                data
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    color: '#fff',
                    formatter: value => value
                },
                legend: {
                    position: 'left'
                }
            }
        }
    });
}