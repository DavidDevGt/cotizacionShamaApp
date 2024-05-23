const CotizacionApp = (() => {
    const productos = [];
    let total = new Decimal(0);

    const form = document.getElementById('productForm');
    const productTableBody = document.querySelector('#productTable tbody');
    const totalElement = document.getElementById('total');
    const generatePDFButton = document.getElementById('generatePDF');

    const agregarProducto = (e) => {
        e.preventDefault();
        const cliente = document.getElementById('cliente').value.trim();
        const cantidad = new Decimal(document.getElementById('cantidad').value);
        const producto = document.getElementById('producto').value.trim();
        const precio = new Decimal(document.getElementById('precio').value);

        if (!cliente || cantidad.isNaN() || cantidad.lte(0) || !producto || precio.isNaN() || precio.lte(0)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos con valores válidos.',
            });
            return;
        }

        const nuevoProducto = {
            nombre: producto,
            cantidad: cantidad,
            precio: precio,
        };

        productos.push(nuevoProducto);
        calcularTotal();
        renderizarTabla();
        limpiarCampos();
    };

    const eliminarProducto = (index) => {
        productos.splice(index, 1);
        calcularTotal();
        renderizarTabla();
    };

    const calcularTotal = () => {
        total = productos.reduce((acc, producto) => acc.plus(producto.cantidad.times(producto.precio)), new Decimal(0));
        totalElement.textContent = `Q${total.toFixed(2)} GTQ`;
    };

    const limpiarCampos = () => {
        document.getElementById('cantidad').value = '';
        document.getElementById('producto').value = '';
        document.getElementById('precio').value = '';
    };

    const renderizarTabla = () => {
        productTableBody.innerHTML = '';
        productos.forEach((producto, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${producto.nombre}</td>
                <td class="px-6 py-4 whitespace-nowrap">${producto.cantidad}</td>
                <td class="px-6 py-4 whitespace-nowrap">Q${producto.precio.toFixed(2)} GTQ</td>
                <td class="px-6 py-4 whitespace-nowrap">Q${producto.cantidad.times(producto.precio).toFixed(2)} GTQ</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button class="text-red-600 hover:text-red-900" onclick="CotizacionApp.eliminarProducto(${index})">
                        <span class="material-icons">delete</span> Eliminar
                    </button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    };

    const init = () => {
        form.addEventListener('submit', agregarProducto);
        generatePDFButton.addEventListener('click', generarPDF);
    };

    return {
        init,
        eliminarProducto,
        productos, // Expose productos
        total      // Expose total
    };
})();

document.addEventListener('DOMContentLoaded', CotizacionApp.init);
