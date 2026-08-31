
export async function generateNewForm() {
    const container = document.getElementById('rejection-info-container');
    container.innerHTML = '';

    container.innerHTML = 
        `<form id="rejection-info-form">
            <div class="row mt-3">
                <div class="col-6 label-over-border ms-auto">
                    <label for="rejection-date" class="form-label m-2">Fecha a reportar</label>
                    <input type="date" class="form-control" id="rejection-date">
                    <p class="error invalid-feedback" id="error-rejectDate" style="color: red;"></p>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col label-over-border">
                    <label for="rejection-observations" class="form-label m-2">Observaciones</label>
                    <input type="text" class="form-control" id="rejection-observations" placeholder="Observaciones adicionales" autocomplete="off">
                    <p class="error invalid-feedback" id="error-rejectObservations" style="color: red;"></p>
                </div>
            </div>
            <div id="rejection-products">
                <div class="d-flex align-items-center pt-2 pb-2">
                    <p class="fst-italic">*Indique las cantidades:</p>
                </div>
                <div id="rejection-products-container" class="mb-4">

                </div>
            </div>
        </form>`;
};

export async function generateExistentForm() {
    const container = document.getElementById('rejection-info-container');
    container.innerHTML = '';
    
    container.innerHTML = 
        `<form id="rejection-info-form">
            <input type="hidden" id="id-rejection">
            <div class="row mt-3">
                <div class="col-6 label-over-border ms-auto">
                    <label for="rejection-date" class="form-label m-2">Fecha del rechazo</label>
                    <input type="date" class="form-control" id="rejection-date" disabled>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col label-over-border">
                    <label for="rejection-observations" class="form-label m-2">Observaciones</label>
                    <input type="text" class="form-control" id="rejection-observations" autocomplete="off" disabled>
                </div>
            </div>
            <div id="rejection-products">
                <div class="d-flex align-items-center pt-2 pb-2">
                    <p class="fst-italic">*Productos reportados:</p>
                </div>
                <div id="rejection-products-container" class="mb-4">

                </div>
            </div>
        </form>`;
};
