import supabase from "../supabase/supabase-client";
// Servicios Supabase
import { getProducts } from "../services/order-product-service";

// Función para cargar datos en los select del formulario
export async function loadOptions(selectId, table, valueKey, textKey, selectedValue = '0') {
    const select = document.getElementById(selectId)
    if (!select) return

    if (selectedValue !== '0') {
        select.innerHTML = '';
    }
    
    const { data, error } = await supabase.from(table).select(`${valueKey}, ${textKey}`)

    if (error) {
        console.error(`Error cargando ${table}:`, error)
        return
    }

    data.forEach(item => {
        const option = document.createElement('option')
        option.value = item[valueKey]
        option.textContent = item[textKey]

        // Si el valor coincide, marcar como seleccionado
        if (selectedValue && item[valueKey] === selectedValue) {
            option.selected = true
        }

        select.appendChild(option)
    })
}

// Función para cargar datos en relación a los productos registrados
export async function loadOptionsFilter(selectId, displayFields, defaultOption, selectedId = 0) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Limpiar contenido previo
    select.innerHTML = '';

    // Obtener productos
    const allProducts = await getProducts();
    if (!allProducts) return;

    // Opción por defecto
    const defaultOptionEl = document.createElement('option');
    defaultOptionEl.value = 0;
    defaultOptionEl.textContent = defaultOption;
    select.appendChild(defaultOptionEl);

    // Eliminar duplicados
    const seenTexts = new Set();

    // Agregar opciones al select
    allProducts.forEach(prod => {
        let text;
        if (Array.isArray(displayFields)) {
            text = displayFields.map(f => prod[f]).filter(Boolean).join(' - ');
        } else {
            text = prod[displayFields];
        }

        if (!text || seenTexts.has(text)) return;
        seenTexts.add(text);

        const optionEl = document.createElement('option');
        optionEl.value = prod.id_producto;
        optionEl.textContent = text;

        // Marcar como seleccionado si coincide con selectedValue
        if (prod.id_producto == selectedId) {
            optionEl.selected = true;
        }

        select.appendChild(optionEl);
    });
}
