
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('trips-form');

    container.innerHTML = 
        `<div id="trips-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3 mb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-truck" viewBox="0 0 16 16">
                            <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5zm1.294 7.456A2 2 0 0 1 4.732 11h5.536a2 2 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456M12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/>
                        </svg>
                    </div>
                    <h5>Programar Nuevo Viaje</h5>
                </div>
            </div>
            <!-- Formulario de programación -->
            <form id="form-trip">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md label-over-border">
                        <label for="tipo" class="form-label m-2">Tipo</label>
                        <select id="tipo" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                            <option value="Partida">Partida</option>
                            <option value="Recolección">Recolección</option>
                            <option value="Ambos">Partida / Recolección</option>
                        </select>
                        <p class="error invalid-feedback" id="tipo-error" style="color: red;"></p>
                    </div>
                    <div class="col-md label-over-border">
                        <label for="fecha_programada" class="form-label m-2">Fecha Programada</label>
                        <input type="date" id="fecha_programada" class="form-control">
                        <p class="error invalid-feedback" id="fecha_programada-error" style="color: red;"></p>
                    </div>
                    <div class="col-md label-over-border">
                        <label for="hora_programada" class="form-label m-2">Hora Programada</label>
                        <input type="time" id="hora_programada" class="form-control">
                        <p class="error invalid-feedback" id="hora_programada-error" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md label-over-border">
                        <label for="unidad" class="form-label m-2">Unidad</label>
                        <select id="unidad" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="unidad-error" style="color: red;"></p>
                    </div>
                    <div class="col-md label-over-border">
                        <label for="caja" class="form-label m-2">Caja</label>
                        <select id="caja" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="caja-error" style="color: red;"></p>
                    </div>
                    <div class="col-md label-over-border">
                        <label for="operador" class="form-label m-2">Operador</label>
                        <select id="operador" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>
                        </select>
                        <p class="error invalid-feedback" id="operador-error" style="color: red;"></p>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-end pt-1 me-3">
                    <button id="btn-cancel" type="button" class="btn btn-secondary d-flex align-items-center ps-3 pe-3 me-2">Cancelar</button>
                    <button id="btn-add" type="button" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock-history" viewBox="0 0 16 16">
                            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
                            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                        </svg>
                        <p class="ps-2">Programar</p>
                    </button>
                </div>
            </form> 
        </div>`;

    //Limitar fecha programada
    const actualDate = new Date();
    // Inicio de la semana actual (Lunes)
    const minDate = new Date(actualDate);
    minDate.setDate(actualDate.getDate() - ((actualDate.getDay() + 6) % 7));

    // Fin de la próxima semana (Sábado)
    const maxDate = new Date(minDate);
    maxDate.setDate(minDate.getDate() + 12);

    // Aplicar min y max al input
    document.getElementById("fecha_programada").min = minDate.toISOString().split("T")[0];
    document.getElementById("fecha_programada").max = maxDate.toISOString().split("T")[0];


    const tripsContainer = document.getElementById('trips-form-container');
    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(tripsContainer, { toggle: false });

    document.getElementById('btn-add-trip').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
    });
});
