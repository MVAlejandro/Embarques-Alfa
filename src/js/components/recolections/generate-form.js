
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('recolections-form');

    container.innerHTML = 
        `<div id="recolections-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3 mb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-geo" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.3 1.3 0 0 0-.37.265.3.3 0 0 0-.057.09V14l.002.008.016.033a.6.6 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.6.6 0 0 0 .146-.15l.015-.033L12 14v-.004a.3.3 0 0 0-.057-.09 1.3 1.3 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465s-2.462-.172-3.34-.465c-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411"/>
                        </svg>
                    </div>
                    <h5>Programar Nueva Recolección</h5>
                </div>
            </div>
            <!-- Formulario de programación -->
            <form id="form-recolection">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-3 label-over-border">
                        <label for="proveedor" class="form-label m-2">Proveedor</label>
                        <select id="proveedor" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>

                        </select>
                        <p class="error invalid-feedback" id="proveedor-error" style="color: red;"></p>
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
                        <label for="destino" class="form-label m-2">Ubicación</label>
                        <input type="text" id="destino" class="form-control" placeholder="Ubicación de la recolección">    
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


    const recolectionsContainer = document.getElementById('recolections-form-container');
    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(recolectionsContainer, { toggle: false });

    document.getElementById('btn-add-recolection').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
    });
});
