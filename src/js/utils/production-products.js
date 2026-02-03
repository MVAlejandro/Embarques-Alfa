// Utilidades
import { amountValidate, quantityValidate } from "./form-validations";

// Función para agregar campos de productos solicitados
export async function addPartitionProdRow(idOrdenProducto, productoCodigo = '', productoNombre = '', cantidadValue = '') {
    const container = document.getElementById("partition-products-container");
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `product-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = "row ms-2 me-2 pt-2 pb-2 partitionP-item";
    newProduct.dataset.idOrdenProducto = idOrdenProducto;
    newProduct.innerHTML =
        `<div class="col-7">
        <input type="text" id="${uniqueId}-partition-product" class="form-control product-code" placeholder="Producto" value="${productoCodigo} - ${productoNombre}" disabled>
        </div>
        <div class="col-5">
            <input type="number" id="${uniqueId}-partition-quantity" class="form-control product-amount" placeholder="Cantidad" value="${cantidadValue}" disabled>
        </div>`;

    container.appendChild(newProduct);

    const productoIn = newProduct.querySelector(".product-amount");
    const productoError = newProduct.querySelector(`#${uniqueId}-cantidad-error`);

    // Validar en tiempo real
    productoIn.addEventListener("input", () => {
        amountValidate(productoIn, productoError);
    });
}

// Función para agregar campos de productos producidos
export async function addProductionProdRow(idOrdenProducto, productoCodigo = '', productoNombre = '', cantidadValue = '', maxValue, data) {
    const container = document.getElementById("production-products-container");
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `product-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = "row ms-2 me-2 pt-2 pb-2 productionP-item";
    newProduct.dataset.idOrdenProducto = idOrdenProducto;
    newProduct.innerHTML =
        `<div class="col-7">
        <input type="text" id="${uniqueId}-production-product" class="form-control product-code" placeholder="Producto" value="${productoCodigo} - ${productoNombre}" disabled>
        </div>
        <div class="col-5">
            <input type="number" id="${uniqueId}-production-quantity" class="form-control production-amount" placeholder="Cantidad" value="${cantidadValue}" data-max="${maxValue}" disabled ${data}>
            <p class="error invalid-feedback" id="${uniqueId}-production-error" style="color: red;"></p>
        </div>`;

    container.appendChild(newProduct);

    const productoIn = newProduct.querySelector(".production-amount");
    const productoError = newProduct.querySelector(`#${uniqueId}-production-error`);

    // Validar en tiempo real
    productoIn.addEventListener("input", () => {
        quantityValidate(productoIn, productoError, maxValue);
    });
}