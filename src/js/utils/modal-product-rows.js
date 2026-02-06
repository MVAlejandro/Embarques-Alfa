// Servicios supabase
import { getProducts } from "../services/order-product-service"; 
// Utilidades
import { quantityValidate } from "./form-validations";
import { loadOptionsFilter } from "./load-select";

// Función para agregar campos de productos solo informativo
export async function viewProductRow(type, idProducto, productCode = '', productName = '', quantityValue = '') {
    const container = document.getElementById(`${type}-products-container`);
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `${type}-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = `row ms-2 me-2 pt-2 pb-2 ${type}Product-item`;
    newProduct.dataset.idProducto = idProducto;
    newProduct.innerHTML =
        `<div class="col-7">
            <input type="text" id="${uniqueId}-product" class="form-control product-view-code" placeholder="Producto" value="${productCode} - ${productName}" disabled>
        </div>
        <div class="col-5">
            <input type="number" id="${uniqueId}-quantity" class="form-control product-view-quantity" placeholder="Cantidad" value="${quantityValue}" disabled>
        </div>`;

    container.appendChild(newProduct);
}

// Función para agregar campos de productos con input y validación de cantidad
export async function validateProductRow(type, idProducto, productCode = '', productName = '', quantityValue = '', maxValue) {
    const container = document.getElementById(`${type}-products-container`);
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `${type}-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = `row ms-2 me-2 pt-2 pb-2 ${type}Product-item`;
    newProduct.dataset.idProducto = idProducto;
    newProduct.innerHTML =
        `<div class="col-7">
        <input type="text" id="${uniqueId}-product" class="form-control product-input-code" placeholder="Producto" value="${productCode} - ${productName}" disabled>
        </div>
        <div class="col-5">
            <input type="number" id="${uniqueId}-quantity" class="form-control product-input-quantity" placeholder="Cantidad" value="${quantityValue}" data-max="${maxValue}">
            <p class="error invalid-feedback" id="${uniqueId}-error" style="color: red;"></p>
        </div>`;

    container.appendChild(newProduct);

    const productoIn = newProduct.querySelector(".product-input-quantity");
    const productoError = newProduct.querySelector(`#${uniqueId}-error`);

    // Validar en tiempo real
    productoIn.addEventListener("input", () => {
        quantityValidate(productoIn, productoError, maxValue);
    });
}

// Función para agregar campos de productos con select
export async function selectProductRow(type, selectedProductId = '0', quantityValue = '') {
    const container = document.getElementById(`${type}-products-container`);
    const index = container.children.length;
    // Colocar id único
    const uniqueId = `${type}-${index}`;

    const newProduct = document.createElement("div");
    newProduct.className = `row ms-2 me-2 pt-2 pb-2 ${type}Product-item`;
    newProduct.innerHTML =
        `<div class="col-6">
            <select class="form-select product-select-code" id="${uniqueId}-select" data-index="${index}">
                <option value="0">Seleccionar producto</option>
            </select>
        </div>
        <div class="col-4">
            <input type="number" id="${uniqueId}-quantity" class="form-control product-select-quantity" placeholder="Cantidad" data-index="${index}" value="${quantityValue}">
        </div>
        <div class="col-2 d-flex align-items-center justify-content-center">
            <button type="button" class="btn btn-remove" data-index="${index}">X</button>
        </div>`;

    container.appendChild(newProduct);

    // Cargar opciones en el select
    await loadOptionsFilter(`${uniqueId}-select`, getProducts, ['codigo', 'nombre'], 'id_producto', "Seleccione Producto...", selectedProductId);
}