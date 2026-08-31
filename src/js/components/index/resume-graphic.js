// Servicios Supabase
import { getPartitions } from "../../services/partitions-service"; 
import { getPartitionProducts } from '../../services/partition-product-service.js';
import { getRejections } from "../../services/rejections-service.js";
import { getRejectionProducts } from "../../services/rejection-product-service.js";

let allPartitions = [];
let allRejections = [];

// Función para crear el gráfico con porcentaje de progreso
export async function renderStatusGraphic(start, end) {
    // Obtener todas las partidas
    allPartitions = await getPartitions();

    // Filtrar por fechas seleccionadas
    allPartitions = allPartitions.filter(p => { const fecha = new Date(p.fecha_programada);
        return fecha >= start && fecha <= end;
    });

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
    const labels = [ "Producción", "Embarque", "Facturación", "Transporte" ];
    const urls = [ "./production.html", "./shipments.html", "./bills.html", "./transport.html" ];

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
                backgroundColor: labels.map((_, index) => {
                    const colores = [
                        "#f4b183",
                        "#95a9d6",
                        "#bce0c8",
                        "#fcebb9"
                    ];

                    return colores[index % colores.length];
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
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    window.location.href = urls[index];
                }
            },

            onHover: (event, elements) => {
                event.native.target.style.cursor =
                    elements.length > 0 ? "pointer" : "default";
            },
            plugins: {
                title: {
                    display: true,
                    text: `PROGRESO GENERAL DE PARTIDAS`,
                    font: { weight: "bold" },
                    padding: { bottom: 30 }
                },
                legend: {
                    display: false
                },
                datalabels: {
                    anchor: "center",
                    align: "center",
                    color: labels.map((_, index) => {
                        const coloresTexto = [
                            "#a64b00",
                            "#0a2a6e",
                            "#0c6e40",
                            "#7e6009"
                        ];

                        return coloresTexto[index % coloresTexto.length];
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
export async function renderClientsGraphic(start, end) {
    // Obtener todas las partidas
    allPartitions = await getPartitions();

    // Filtrar por fechas seleccionadas
    allPartitions = allPartitions.filter(p => { const fecha = new Date(p.fecha_programada);
        return fecha >= start && fecha <= end;
    });

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
        const clientId = partida.id_cliente;
        const clientName = partida.cliente;

        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);

        // Sumar cantidades solicitadas
        const totalRequiredAmount = productos.reduce(
            (acc, prod) => acc + (Number(prod.cantidad_solicitada) || 0),
            0
        );

        // Inicializar cliente y acumular productos
        if (!clientProducts[clientId]) {
            clientProducts[clientId] = {
                id: clientId,
                nombre: clientName,
                cantidad: 0
            };
        }

        clientProducts[clientId].cantidad += totalRequiredAmount;
    }

    // Ordenar clientes de mayor a menor cantidad
    const sortedClients = Object.entries(clientProducts).sort((a, b) => b[1].cantidad - a[1].cantidad);

    // Preparar datos para el gráfico
    const labels = sortedClients.map(([, clientData]) => clientData.nombre);
    const data = sortedClients.map(([, clientData]) => clientData.cantidad);

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
            onClick: (event, elements) => {
                if (!elements.length) {
                    return;
                }

                const index = elements[0].index;

                const client = labels[index];

                window.location.href =
                    `./partitions.html?client=${encodeURIComponent(client)}`;
            },

            onHover: (event, elements) => {
                event.native.target.style.cursor =
                    elements.length ? "pointer" : "default";
            },
            plugins: {
                title: {
                    display: true,
                    text: `CANTIDAD DE PRODUCTOS SOLICITADOS POR CLIENTE`,
                    font: { weight: "bold" },
                    padding: { bottom: 30 }
                },
                legend: { display: false },
                datalabels: {
                    color: "#5e8132",
                    font: { 
                        weight: "bold",
                        size: 10
                     },
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

export async function renderRejectionsGraphic(start, end) {
    // Obtener todas las partidas y rechazos
    allPartitions = await getPartitions();
    allRejections = await getRejections();

    // Filtrar por fechas seleccionadas
    allPartitions = allPartitions.filter(p => { const fecha = new Date(p.fecha_programada);
        return fecha >= start && fecha <= end;
    });
    allRejections = allRejections.filter(r => { const fecha = new Date(r.fecha_rechazo);
        return fecha >= start && fecha <= end;
    });
    
    const container = document.getElementById("graphic-rejected-container");
    // Limpiar gráfico anterior
    container.innerHTML = "";

    if (!allRejections.length) {
        container.innerHTML = `
            <div class="alert alert-info">
                No hay rechazos esta semana
            </div>`;
        return;
    }

    // Sumar productos solicitados de las partidas
    let totalPartitionsAmount = 0;

    for (const partida of allPartitions) {
        // Obtener productos de la partida
        const productos = await getPartitionProducts(partida.id_partida);

        // Sumar cantidades solicitadas
        totalPartitionsAmount += productos.reduce(
            (acc, prod) => acc + (Number(prod.cantidad_solicitada) || 0),
            0
        );
    }

    // Sumar productos rechazados
    let totalRejectionsAmount = 0;

    for (const rechazo of allRejections) {
        // Obtener productos del rechazo
        const productos = await getRejectionProducts(rechazo.id_rechazo);

        // Sumar cantidades rechazadas
        totalRejectionsAmount += productos.reduce(
            (acc, prod) => acc + (Number(prod.cantidad_rechazada) || 0),
            0
        );
    }

    // Calcular cantidad no rechazada
    const totalNonRejectedAmount = Math.max( totalPartitionsAmount - totalRejectionsAmount, 0 ); 

    // Generar gráfico
    container.innerHTML = '<canvas id="rejected-graphic"></canvas>';
    const ctx = document.getElementById('rejected-graphic').getContext('2d');

    new Chart(ctx, { 
        type: "pie", 
        data: { 
            labels: [ "Rechazados", "No rechazados" ], 
            datasets: [{ 
                data: [ totalRejectionsAmount, totalNonRejectedAmount ], 
                backgroundColor: [ "#f13b44", "#8FC74A" ]
            }] 
        }, 
        options: { 
            responsive: true, 
            layout: {
                padding: {
                    right: 10,
                    left: 10
                }
            },
            maintainAspectRatio: false, 
            plugins: { 
                title: {
                    display: true,
                    text: `CANTIDAD DE PRODUCTOS RECHAZADOS`,
                    font: { weight: "bold" },
                    padding: { bottom: 30 }
                },
                datalabels: {
                    display: false
                },
                legend: { 
                    position: "bottom",
                    labels: {
                        generateLabels(chart) {
                            const data = chart.data;
                            const dataset = data.datasets[0];

                            return data.labels.map((label, index) => {
                                const value = Number(dataset.data[index]) || 0;

                                const percentage = totalPartitionsAmount > 0
                                    ? (value / totalPartitionsAmount) * 100
                                    : 0;

                                return {
                                    text: `${label}: ${percentage.toFixed(2)}%`,
                                    fillStyle: dataset.backgroundColor[index],
                                    strokeStyle: dataset.backgroundColor[index],
                                    lineWidth: 1,
                                    hidden: false,
                                    index
                                };
                            });
                        }
                    }
                 }, 
                tooltip: { 
                    callbacks: { 
                        label: function(context) { 
                            const value = context.raw; 
                            const percentage = totalPartitionsAmount > 0 ? (value / totalPartitionsAmount) * 100 : 0; 
                            return `${context.label}: ${value.toLocaleString('en-US')} (${percentage.toFixed(2)}%)`; 
                        }
                    }
                }
            }
        }
    });
}