
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('orders-form');

    container.innerHTML = 
        `<div id="orders-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                        </svg>
                    </div>
                    <h5>Registrar Nuevo Contrato</h5>
                </div>
            </div>
            <!-- Formulario de órdenes -->
            <form id="order-form">
                <div class="row ms-2 me-2 pt-3 pb-3">
                    <div class="col-md-4 label-over-border">
                        <label for="cliente" class="form-label m-2">Cliente</label>
                        <select id="cliente" class="form-select" aria-label="Default select example">
                            <option value="0">Seleccione...</option>

                        </select>
                        <p class="error invalid-feedback" id="cliente-error" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 label-over-border">
                        <label for="numero_orden" class="form-label m-2">Número de Orden</label>
                        <input type="number" id="numero_orden" class="form-control no-arrows" placeholder="0011223344">
                        <p class="error invalid-feedback" id="numero_orden-error" style="color: red;"></p>
                    </div>
                    <div class="col-md-4 label-over-border">
                        <label for="numero_contrato" class="form-label m-2">Número de Contrato</label>
                        <input type="number" id="numero_contrato" class="form-control no-arrows" placeholder="0000">
                        <p class="error invalid-feedback" id="numero_contrato-error" style="color: red;"></p>
                    </div>
                </div>
                <div class="d-flex align-items-center justify-content-end pt-1 me-3">
                    <button id="btn-cancel" type="button" class="btn btn-secondary d-flex align-items-center ps-3 pe-3 me-2">Cancelar</button>
                    <button id="btn-add-manual" type="button" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                            <path d="M11 2H9v3h2z"/>
                            <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                        </svg>
                        <p class="ps-2">Agregar</p>
                    </button>
                </div>
            </form> 
        </div>`;

    const ordersContainer = document.getElementById('orders-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(ordersContainer, { toggle: false });

    document.getElementById('btn-add-order').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel').addEventListener('click', () => {
        collapseInstance.hide();
    });
});