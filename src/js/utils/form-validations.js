
// Expresiones regulares para validación de datos
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Nombres y el apellidos
const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,()\/\-–—]+$/; // Texto con algunos caracteres especiales
const rfcRegex = /^([A-Z&Ñ]{3,4})\d{6}[A-Z0-9]{3}$/; // RFC
const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+$/; // Email
const phoneRegex = /^[1-9]\d{9}$/; // Número telefónico
const cpRegex = /^\d{5}$/ // Código postal
const amountRegex = /^\d+([-\.]\d{1,2})?$/ // Cantidades y precios

// Función que valida que los campos sean solo letras, algunos caracteres especiales y que haya al menos 3 caracteres
export function textValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        data.classList.add('is-invalid');
    } else if (!textRegex.test(data.value)) {
        error.textContent = `El campo no acepta esos caracteres especiales`;
        data.classList.add('is-invalid');
    } else {
        error.textContent = '';
        data.classList.add('is-valid');
    }
}

// Función que valida que los campos sean solo letras y que haya al menos 3 caracteres
export function nameValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (data.value.length < 3) {
        error.textContent = `El campo debe de tener al menos 3 caracteres`;
        data.classList.add('is-invalid');
    } else if (!nameRegex.test(data.value)) {
        error.textContent = `El campo no acepta caracteres especiales ni números`;
        data.classList.add('is-invalid');
    } else {
        error.textContent = '';
        data.classList.add('is-valid');
    }
}

// Función que valida que el rfc tenga un formato válido
export  function rfcValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (!rfcRegex.test(data.value)) {
        error.textContent=`El RFC debe de cumplir con el formato válido`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que el correo tenga un formato válido
export  function emailValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (!emailRegex.test(data.value)) {
        error.textContent=`El correo debe de cumplir con el formato example@example.com`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que sea un número telefónico
export function phoneValidate(data, error) {
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if (!phoneRegex.test(data.value.trim())) {
        error.textContent=`El número telefónico no es válido`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que el código postal sea correcto
export function cpValidate (data, error){
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if(!cpRegex.test(data.value)){
        error.textContent=`El código postal no es válido`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que el costo sea válido
export function amountValidate (data, error){
    error.textContent = '';
    data.classList.remove('is-invalid', 'is-valid');

    if(!amountRegex.test(data.value)){
        error.textContent=`El dato no es válido`;
        data.classList.add('is-invalid');
        data.classList.remove('is-valid');
    } else {
        error.textContent = '';
        data.classList.remove('is-invalid');
        data.classList.add('is-valid');
    }
}

// Función que valida que los inputs no vayan vacíos
export function inputValidate(campos) {
    for (let campo of campos) {
        if (campo.classList.contains('is-invalid')) {
        return false;
        }
    }
    return true;
} 

// Función que valida la selección de una opción en selects
export function selectValidate(selectElement, errorElement) {
    const valor = selectElement.value;

    if (valor === '0') {
        selectElement.classList.add('is-invalid');
        selectElement.classList.remove('is-valid');
        if (errorElement) {
            errorElement.textContent = 'Se debe seleccionar una opción';
        }
        return false;
    } else {
        selectElement.classList.remove('is-invalid');
        selectElement.classList.add('is-valid');
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }
}