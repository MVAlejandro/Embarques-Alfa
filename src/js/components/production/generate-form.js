
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('partitions-form');

    container.innerHTML = 
        `<div id="partitions-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3 mb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16">
                            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
                        </svg>
                    </div>
                    <h5>Programar Nueva Partida</h5>
                </div>
            </div>
            <!-- Formulario de programación -->
            <form id="form-partition">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-3 label-over-border">
                        <label for="contrato" class="form-label m-2">Contrato</label>
                        <select id="contrato" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>

                        </select>
                        <p class="error invalid-feedback" id="contrato-error" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="fecha_programada" class="form-label m-2">Fecha Programada</label>
                        <input type="date" id="fecha_programada" class="form-control">
                        <p class="error invalid-feedback" id="fecha_programada-error" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="hora_programada" class="form-label m-2">Hora Programada</label>
                        <input type="time" id="hora_programada" class="form-control">
                        <p class="error invalid-feedback" id="hora_programada-error" style="color: red;"></p>
                    </div>
                    <div class="col-md-3 label-over-border">
                        <label for="destino" class="form-label m-2">Destino</label>
                        <input type="text" id="destino" class="form-control" placeholder="Destino de la entrega">    
                        <p class="error invalid-feedback" id="destino-error" style="color: red;"></p>
                    </div>
                </div>
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-6 ms-auto label-over-border">
                        <label for="observaciones" class="form-label m-2">Observaciones</label>
                        <input type="text" id="observaciones" class="form-control" placeholder="Observaciones adicionales">    
                        <p class="error invalid-feedback" id="observaciones-error" style="color: red;"></p>
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


    const partitionsContainer = document.getElementById('partitions-form-container');
    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(partitionsContainer, { toggle: false });

    document.getElementById('btn-add-partition').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
    });
});
