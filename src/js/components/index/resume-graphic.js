// Servicios Supabase
import { getPartitions } from "../../services/partitions-service"; 
import { getPartitionProducts } from '../../services/partition-product-service.js';

let allPartitions = [];

// Función para crear el gráfico con porcentaje de progreso
export async function renderStatusGraphic(dates) {
    // Obtener todas las partidas
    let allPartitions = await getPartitions();

    // Filtrar por semana y año
    allPartitions = allPartitions.filter( p => p.semana == dates.semana && p.anio == dates.anio );

    const container = document.getElementById("graphic-status-container");

    // Limpiar gráfico anterior
    container.innerHTML = "";

    if (!allPartitions.length) {
        container.innerHTML = `
            <div class="alert alert-info">
                No hay partidas esta semana
            </div>`;
        return;
    }

    // Obtener el total de partidas y contar estados finales
    const totalPartidas = allPartitions.length;

    const plantaTerminado = allPartitions.filter(partida => partida.planta === "Terminado").length;
    const embarqueCargado = allPartitions.filter(partida => partida.embarque === "Cargado").length;
    const facturacionDocumentado = allPartitions.filter(partida => partida.facturacion === "Documentado").length;
    const transporteEntregado = allPartitions.filter(partida => partida.transporte === "Entregado").length;

    // Calcular porcentajes
    const porcentajePlanta = (plantaTerminado / totalPartidas) * 100;
    const porcentajeEmbarque = (embarqueCargado / totalPartidas) * 100;
    const porcentajeFacturacion = (facturacionDocumentado / totalPartidas) * 100;
    const porcentajeTransporte = (transporteEntregado / totalPartidas) * 100;

    // Datos
    const labels = [
        "Producción",
        "Embarque",
        "Facturación",
        "Transporte"
    ];

    const data = [
        porcentajePlanta,
        porcentajeEmbarque,
        porcentajeFacturacion,
        porcentajeTransporte
    ];

    const cantidades = [
        plantaTerminado,
        embarqueCargado,
        facturacionDocumentado,
        transporteEntregado
    ];

    // Crear canvas
    container.innerHTML = `<canvas id="status-graphic"></canvas>`;
    const ctx = document.getElementById("status-graphic").getContext("2d");

    // Crear gráfico
    new Chart(ctx, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Partidas con estado final",
                data,
                borderColor: "#C7C6C6",
                backgroundColor: data.map(value => {
                    if (value >= 95) { return "#bce0c8"; }

                    if (value >= 70) { return "#95a9d6"; }

                    if (value >= 40) { return "#fcebb9"; }

                    return "#dd989f";
                }),
                borderRadius: 10,
                borderWidth: 1,
                // Hacer las barras más delgadas
                barPercentage: 0.6,
                categoryPercentage: 0.7
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            layout: {
                padding: {
                    right: 20,
                    left: 20
                }
            },
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `PROGRESO GENERAL DE PARTIDAS (SEMANAL)`,
                    font: { weight: "bold" },
                    padding: { bottom: 30 }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: "center",
                    align: "center",
                    color: data.map(value => {
                    if (value >= 95) { return "#0c6e40"; }

                    if (value >= 70) { return "#0a2a6e"; }

                    if (value >= 40) { return "#7e6009"; }

                    return "#79111c";
                }),
                    font: { weight: "bold" },
                    formatter: (value, context) => {
                        const cantidad = cantidades[context.dataIndex];
                        return `${value.toFixed(1)}% (${cantidad}/${totalPartidas})`;
                    }
                },
                tooltip: {
                    callbacks: {
                        label: context => {
                            const cantidad = cantidades[context.dataIndex];
                            return `${context.raw.toFixed(1)}% (${cantidad}/${totalPartidas} partidas)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: false,
                        text: "Porcentaje"
                    },
                    ticks: {
                        callback: value => `${value}%`
                    }
                },
                y: {
                    title: {
                        display: false,
                        text: "Proceso"
                    }
                }
            }
        }
    });
}

// Función para crear el gráfico por productos
export async function renderClientsGraphic(dates) {
    // Obtener todas las partidas
    let allPartitions = await getPartitions();

    // Filtrar por semana y año
    allPartitions = allPartitions.filter( p => p.semana == dates.semana && p.anio == dates.anio );

    const container = document.getElementById("graphic-client-container");

    // Limpiar gráfico anterior
    container.innerHTML = "";

    if (!allPartitions.length) {
        container.innerHTML = `
            <div class="alert alert-info">
                No hay partidas esta semana
            </div>`;
        return;
    }

    // Sumar productos solicitados por cliente
    const clientProducts = {};

    for (const partida of allPartitions) {
        const client = partida.cliente;

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);

        // Sumar cantidades solicitadas
        const totalRequiredAmount = productos.reduce( (acc, prod) => acc + (Number(prod.cantidad_solicitada) || 0), 0 );

        // Inicializar cliente y acumular productos
        if (!clientProducts[client]) {
            clientProducts[client] = 0;
        }

        clientProducts[client] += totalRequiredAmount;
    }

    // Preparar datos para el gráfico
    const labels = Object.keys(clientProducts);
    const data = Object.values(clientProducts);

    // Crear canvas
    container.innerHTML = `<canvas id="client-graphic"></canvas>`;
    const ctx = document.getElementById("client-graphic").getContext("2d");

    // Crear gráfico
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Productos solicitados",
                data: data,
                borderColor: "#C7C6C6",
                backgroundColor: "#8FC74A",
            }]
        },
        options: {
            responsive: true,
            layout: {
                padding: {
                    right: 20,
                    left: 20
                }
            },
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `CANTIDAD DE PRODUCTOS SOLICITADOS POR CLIENTE (SEMANAL)`,
                    font: { weight: "bold" },
                    padding: { bottom: 30 }
                },
                legend: { display: false },
                datalabels: {
                    color: "#5e8132",
                    font: { weight: "bold" },
                    anchor: "end",
                    align: "top",
                    formatter: value => value
                }
            },
            scales: {
                x: {
                    title: {
                        display: false,
                        text: "Cliente"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: false,
                        text: "Cantidad de productos solicitados"
                    },
                    ticks: { precision: 0 }
                }
            }
        }
    });
}