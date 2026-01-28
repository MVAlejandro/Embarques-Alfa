
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('units-form');

    container.innerHTML = 
        `<div id="units-form-container" class="container pt-4 pb-3 collapse">
            <div class="row pb-3">
                <div class="col d-flex align-items-center">
                    <div class="ms-4 me-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-truck-flatbed" viewBox="0 0 16 16">
                            <path d="M11.5 4a.5.5 0 0 1 .5.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-4 0 1 1 0 0 1-1-1v-1h11V4.5a.5.5 0 0 1 .5-.5M3 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2m1.732 0h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4a2 2 0 0 1 1.732 1"/>
                        </svg>
                    </div>
                    <h5>Registrar Nueva Unidad</h5>
                </div>
                <div class="col d-flex justify-content-end controls btn-group me-3 mb-3 d-none" data-admin-only>
                    <div class="nav nav-pills" id="ganttTabs" role="tablist">
                        <button id="manual-tab" class="nav-link tab-btn active" data-bs-toggle="pill" data-bs-target="#tab-form-manual" type="button" role="tab">Manual</button>
                        <button id="excel-tab" class="nav-link tab-btn d-none" data-bs-toggle="pill" data-bs-target="#tab-form-excel" type="button" role="tab">Excel</button>
                    </div>
                </div>
            </div>
            <div class="tab-content" id="units-tabs-content">
                <!-- Tab de Excel -->
                <div class="tab-pane fade" id="tab-form-excel" role="tabpanel">
                    <form id="form-excel">
                        <div class="row ms-2 me-2 pb-3">
                            <div class="col label-over-border">
                                <label for="excel-data" class="m-2">Datos de la unidad</label>
                                <textarea id="excel-data" class="form-control" rows="4" placeholder="Ingrese los datos desde Excel con formato:  'Nombre, Tipo, Placas, Póliza, Descripción'"></textarea>
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
                            <div class="col-md-2 label-over-border">
                                <label for="tipo" class="form-label m-2">Tipo</label>
                                <select id="tipo" class="form-select" aria-label="Default select example">
                                    <option value="0">Seleccione...</option>
                                    <option value="Camión">Camión</option>
                                    <option value="Tracto">Tracto</option>
                                    <option value="Caja">Caja</option>
                                </select>
                                <p class="error invalid-feedback" id="error-tipo" style="color: red;"></p>
                            </div>
                            <div class="col-md-3 label-over-border">
                                <label for="nombre" class="form-label m-2">Nombre</label>
                                <input type="text" id="nombre" class="form-control" placeholder="Camión UNI-001">
                                <p class="error invalid-feedback" id="error-nombre" style="color: red;"></p>
                            </div>
                            <div class="col-md-2 label-over-border">
                                <label for="placas" class="form-label m-2">Placas</label>
                                <input type="text" id="placas" class="form-control" placeholder="ABC-DEF1">
                                <p class="error invalid-feedback" id="error-placas" style="color: red;"></p>
                            </div>
                            <div class="col-md-2 label-over-border">
                                <label for="poliza" class="form-label m-2">Póliza</label>
                                <input type="text" id="poliza" class="form-control" placeholder="XX-12345">
                                <p class="error invalid-feedback" id="error-poliza" style="color: red;"></p>
                            </div>
                            <div class="col-md-3 label-over-border">
                                <label for="descripcion" class="form-label m-2">Descripción</label>
                                <input type="text" id="descripcion" class="form-control" placeholder="Unidad de 2.5 toneladas, color blanco">
                                <p class="error invalid-feedback" id="error-descripcion" style="color: red;"></p>
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

    const unitsContainer = document.getElementById('units-form-container');

    // Crear instancia única de Collapse
    const collapseInstance = new bootstrap.Collapse(unitsContainer, { toggle: false });

    document.getElementById('btn-add-unit').addEventListener('click', () => {
        collapseInstance.show();
    });

    document.getElementById('btn-cancel-manual').addEventListener('click', () => {
        collapseInstance.hide();
    });

    document.getElementById('btn-cancel-excel').addEventListener('click', () => {
        collapseInstance.hide();
    });
});
