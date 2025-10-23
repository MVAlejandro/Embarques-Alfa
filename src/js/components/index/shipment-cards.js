
const container = document.getElementById('ship-cards-container');

document.addEventListener("DOMContentLoaded", () => {
    createShipmentCard("Pendiente", 15, 65)
    createShipmentCard("En proceso", 8, 100)
    createShipmentCard("Completado", 4, 30)
});

function createShipmentCard(text, cant, percent) {
    container.insertAdjacentHTML('beforeend',
        `<div class="col-4">
            <div class="card order-card mb-1">
                <div class="card-body d-flex justify-content-center align-items-end p-0" 
                    style="background: linear-gradient(to top, var(--primary) ${percent}%, var(--primary-light) ${percent}%); 
                    border-radius: 10px 10px 0 0;"
                >
                    <p class="fw-bold ship-cant">${cant}</p>
                </div>
            </div>
            <p class="text-center fw-bold ship-text">${text}</p>
        </div>`
    );
}