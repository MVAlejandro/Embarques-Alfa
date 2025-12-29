
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('clients-form');

    container.innerHTML = 
        `<div id="clients-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                            <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
                        </svg>
                    </div>
                    <h5>Registrar Nuevo Cliente</h5>
                </div>
                <div class="col d-flex justify-content-end controls btn-group me-3 mb-3">
                    <div class="nav nav-pills" id="ganttTabs" role="tablist">
                        <button id="manual-tab" class="nav-link tab-btn active" data-bs-toggle="pill" data-bs-target="#tab-form-manual" type="button" role="tab">Manual</button>
                        <button id="excel-tab" class="nav-link tab-btn d-none" data-bs-toggle="pill" data-bs-target="#tab-form-excel" type="button" role="tab">Excel</button>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="clients-tabs-content">
                <!-- Tab de Excel -->
                <div class="tab-pane fade" id="tab-form-excel" role="tabpanel">
                    <form id="form-excel">
                        <div class="row ms-2 me-2 pb-3">
                            <div class="col label-over-border">
                                <label for="excel-data" class="m-2">Datos del cliente</label>
                                <textarea id="excel-data" class="form-control" rows="4" placeholder="Ingrese los datos desde Excel con formato:  'Nombre, Razón, RFC, Teléfono, Email, CP, Ubicación'"></textarea>
                                <p class="error invalid-feedback" id="error-excel-data" style="color: red;"></p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end pt-1 me-3">
                            <button id="btn-cancel-excel" type="button" class="btn btn-secondary d-flex align-items-center ps-3 pe-3 me-2">Cancelar</button>
                            <button id="btn-add-excel" type="button" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                                    <path d="M11 2H9v3h2z"/>
                                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                                </svg>
                                <p class="ps-2">Agregar</p>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Tab de llenado manual -->
                <div class="tab-pane fade show active" id="tab-form-manual" role="tabpanel">
                    <form id="form-manual">
                        <div class="row ms-2 me-2 pt-3 pb-3">
                            <div class="col-md-3 label-over-border">
                                <label for="nombre" class="form-label m-2">Cliente</label>
                                <input type="text" id="nombre" class="form-control" placeholder="Nombre del cliente">
                                <p class="error invalid-feedback" id="error-nombre" style="color: red;"></p>
                            </div>
                            <div class="col-md-4 label-over-border">
                                <label for="razon_social" class="form-label m-2">Razón social</label>
                                <input type="text" id="razon_social" class="form-control" placeholder="Empresa SA de CV">
                                <p class="error invalid-feedback" id="error-razon_social" style="color: red;"></p>
                            </div>
                            <div class="col-md-2 label-over-border">
                                <label for="rfc" class="form-label m-2">RFC</label>
                                <input type="text" id="rfc" class="form-control" placeholder="XAXX010101000">
                                <p class="error invalid-feedback" id="error-rfc" style="color: red;"></p>
                            </div>
                            <div class="col-md-3 label-over-border">
                                <label for="numero_telefono" class="form-label m-2">Teléfono</label>
                                <input type="number" id="numero_telefono" class="form-control no-arrows" placeholder="55 1234 5678">
                                <p class="error invalid-feedback" id="error-numero_telefono" style="color: red;"></p>
                            </div>
                        </div>
                        <div class="row ms-2 me-2 pt-3 pb-3">
                            <div class="col-md-4 label-over-border">
                                <label for="correo" class="form-label m-2">Email</label>
                                <input type="email" id="correo" class="form-control" placeholder="email@mail.com">
                                <p class="error invalid-feedback" id="error-correo" style="color: red;"></p>
                            </div>
                            <div class="col-md-2 label-over-border">
                                <label for="codigo_postal" class="form-label m-2">CP</label>
                                <input type="number" id="codigo_postal" class="form-control no-arrows" placeholder="Código postal">
                                <p class="error invalid-feedback" id="error-codigo_postal" style="color: red;"></p>
                            </div>
                            <div class="col-md-6 label-over-border">
                                <label for="ubicacion" class="form-label m-2">Ubicación</label>
                                <input type="text" id="ubicacion" class="form-control" placeholder="Ciudad, Estado">    
                                <p class="error invalid-feedback" id="error-ubicacion" style="color: red;"></p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-end pt-1 me-3">
                            <button id="btn-cancel-manual" type="button" class="btn btn-secondary d-flex align-items-center ps-3 pe-3 me-2">Cancelar</button>
                            <button id="btn-add-manual" type="button" class="btn btn-primary d-flex align-items-center ps-3 pe-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy pe-1" viewBox="0 0 16 16">
                                    <path d="M11 2H9v3h2z"/>
                                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                                </svg>
                                <p class="ps-2">Agregar</p>
                            </button>
                        </div>
                    </form>
                </div>
            </div>  
        </div>`;

    const clientsContainer = document.getElementById('clients-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(clientsContainer, { toggle: false });

    document.getElementById('btn-add-client').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel-manual').addEventListener('click', () => {
        collapseInstance.hide();
    });

    document.getElementById('btn-cancel-excel').addEventListener('click', () => {
        collapseInstance.hide();
    });
});
