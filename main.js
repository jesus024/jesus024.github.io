// Variable global para controlar modo edición
let editId = null;

function errorText(text) {
    showToast(` ${text}`, '#fa709a');
}

function greatText(text) {
    showToast(` ${text}`, '#4facfe');
}

function showToast(message, color) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, ${color}, ${color}88);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: bold;
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
}

// Añadir animaciones CSS para las notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

function agregarFila(product) {
    const tr = document.createElement('tr');
    tr.style.animation = 'fadeInUp 0.4s ease-out';

    const tdId = document.createElement('td');
    tdId.textContent = product.id;
    tr.appendChild(tdId);

    const tdProducto = document.createElement('td');
    tdProducto.textContent = product.name;
    tr.appendChild(tdProducto);

    const tdPrecio = document.createElement('td');
    tdPrecio.textContent = `$${product.price}`;
    tr.appendChild(tdPrecio);

    const tdCantidad = document.createElement('td');
    tdCantidad.textContent = product.quantity;
    tr.appendChild(tdCantidad);

    const tdOpciones = document.createElement('td');
    const divBtns = document.createElement('div');
    divBtns.className = 'td-btn';

    const btnUpdate = document.createElement('button');
    btnUpdate.textContent = ' Edit';
    btnUpdate.id = 'update-product';

    const btnDelete = document.createElement('button');
    btnDelete.textContent = ' Delete';
    btnDelete.id = 'delete-product';

    divBtns.appendChild(btnUpdate);
    divBtns.appendChild(btnDelete);
    tdOpciones.appendChild(divBtns);
    tr.appendChild(tdOpciones);

    document.querySelector('.container_master').appendChild(tr);
}

document.addEventListener('DOMContentLoaded', () => {
    const save = document.querySelector('#btn-save');

    // Simulación de carga de datos
    setTimeout(() => {
        greatText("Welcome to Modern CRUD!");
        // Agregar algunos productos de ejemplo
        const exampleProducts = [
            { id: 1, name: "Laptop Gaming", quantity: 5, price: 1139.99 },
            { id: 2, name: "PS5 Standard Console", quantity: 25, price: 1299.99 },
            { id: 3, name: "Mechanical Keyboard", quantity: 15, price: 159.99 }
        ];

        exampleProducts.forEach(product => {
            agregarFila(product);
        });
    }, 500);

    save.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.querySelector('#name-product').value.trim();
        const quantity = parseInt(document.querySelector('#quantity-product').value);
        const price = parseFloat(document.querySelector('#price-product').value);

        if (name === "" || isNaN(quantity) || quantity <= 0 || isNaN(price) || price <= 0) {
            errorText("Please fill all fields with valid data");
            return;
        }

        if (editId !== null) {
            // Estamos editando un producto existente

            // Buscar la fila con el id editId y actualizar datos
            const rows = document.querySelectorAll('.container_master tr');
            rows.forEach(row => {
                const idCell = row.querySelector('td');
                if (parseInt(idCell.textContent) === editId) {
                    row.children[1].textContent = name;
                    row.children[2].textContent = `$${price}`;
                    row.children[3].textContent = quantity;
                }
            });

            greatText("Product updated successfully!");
            editId = null; // Salir del modo edición
            save.textContent = 'Save'; // Cambiar texto botón a Save

        } else {
            // Nuevo producto

            // Obtener siguiente id automáticamente
            const rows = document.querySelectorAll('.container_master tr');
            let nextId = 1;
            rows.forEach(row => {
                const idCell = row.querySelector('td');
                const currentId = parseInt(idCell.textContent);
                if (!isNaN(currentId) && currentId >= nextId) {
                    nextId = currentId + 1;
                }
            });

            const newProduct = {
                id: nextId,
                name: name,
                quantity: quantity,
                price: price
            };

            agregarFila(newProduct);
            greatText("Product saved successfully!");
        }

        // Limpiar formulario
        document.querySelector('.Form-product').reset();
    });

    // Event delegation para botones dinámicos
    document.addEventListener('click', (e) => {
        if (e.target.id === 'update-product') {
            e.preventDefault();

            // Obtener la fila padre
            const tr = e.target.closest('tr');
            const id = parseInt(tr.querySelector('td').textContent);
            const name = tr.children[1].textContent;
            const price = parseFloat(tr.children[2].textContent.replace('$', ''));
            const quantity = parseInt(tr.children[3].textContent);

            // Rellenar formulario
            document.querySelector('#name-product').value = name;
            document.querySelector('#quantity-product').value = quantity;
            document.querySelector('#price-product').value = price;

            // Guardar id para edición
            editId = id;

            // Cambiar texto botón a actualizar
            save.textContent = 'Update';

            greatText("Edit mode activated. Modify data and click Update.");
        }

        if (e.target.id === 'delete-product') {
            e.preventDefault();
            if (confirm('Are you sure you want to delete this product?')) {
                e.target.closest('tr').remove();
                greatText("Product deleted successfully!");
            }
        }
    });
});