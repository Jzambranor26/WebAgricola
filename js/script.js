document.addEventListener('DOMContentLoaded', function() {
    // ========== CARRITO DE COMPRAS ==========
    const carrito = [];
    const itemsCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const contadorCarrito = document.getElementById('contador-carrito');
    const btnVaciar = document.getElementById('vaciar-carrito');
    const btnPagar = document.getElementById('pagar-carrito');
    const modalCarrito = new bootstrap.Modal(document.getElementById('modal-carrito'));

    // Función para formatear como dólares (con 2 decimales)
    function formatoDolares(valor) {
        return `$${parseFloat(valor).toFixed(2)}`;
    }

    // Eventos del carrito
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-comprar') || e.target.parentElement.classList.contains('btn-comprar')) {
            e.preventDefault();
            const btn = e.target.classList.contains('btn-comprar') ? e.target : e.target.parentElement;
            agregarAlCarrito(btn);
        }
        
        if (e.target.classList.contains('eliminar-item')) {
            e.preventDefault();
            const id = e.target.getAttribute('data-id');
            eliminarDelCarrito(id);
        }
    });
    
    btnVaciar.addEventListener('click', vaciarCarrito);
    btnPagar.addEventListener('click', pagarCarrito);
    
    // Funciones del carrito
    function agregarAlCarrito(btn) {
        const id = btn.getAttribute('data-id');
        const nombre = btn.getAttribute('data-nombre');
        const precio = parseFloat(btn.getAttribute('data-precio')); // Convertir a número decimal
        
        const itemExistente = carrito.find(item => item.id === id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({ 
                id, 
                nombre, 
                precio, // Ya en formato dólar
                cantidad: 1 
            });
        }
        
        actualizarCarrito();
        mostrarFeedback(nombre);
    }
    
    function eliminarDelCarrito(id) {
        const index = carrito.findIndex(item => item.id === id);
        
        if (index !== -1) {
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            } else {
                carrito.splice(index, 1);
            }
            actualizarCarrito();
        }
    }
    
    function vaciarCarrito() {
        carrito.length = 0;
        actualizarCarrito();
    }
    
    function pagarCarrito() {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        alert(`¡Compra realizada por ${formatoDolares(calcularTotal())}! Gracias por su compra.`);
        vaciarCarrito();
        modalCarrito.hide();
    }
    
    function calcularTotal() {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }
    
    function actualizarCarrito() {
        itemsCarrito.innerHTML = '';
        carrito.forEach(item => {
            const li = document.createElement('div');
            li.className = 'carrito-item d-flex justify-content-between align-items-center mb-2';
            li.innerHTML = `
                <div>
                    <h6 class="mb-0">${item.nombre}</h6>
                    <small class="text-muted">${formatoDolares(item.precio)} x ${item.cantidad}</small>
                </div>
                <div>
                    <span class="fw-bold">${formatoDolares(item.precio * item.cantidad)}</span>
                    <button class="btn btn-sm btn-outline-danger eliminar-item ms-2" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            itemsCarrito.appendChild(li);
        });
        
        const total = calcularTotal();
        totalCarrito.textContent = formatoDolares(total);
        contadorCarrito.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contadorCarrito.style.display = carrito.length ? 'block' : 'none';
    }
    
    function mostrarFeedback(nombre) {
        const feedback = document.createElement('div');
        feedback.className = 'position-fixed bottom-0 end-0 p-3';
        feedback.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Producto añadido</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    <i class="fas fa-check-circle me-2"></i> ${nombre} se ha añadido al carrito
                </div>
            </div>
        `;
        document.body.appendChild(feedback);
        setTimeout(() => {
            feedback.querySelector('.toast').classList.remove('show');
            setTimeout(() => feedback.remove(), 500);
        }, 3000);
    }

    



    // ========== FORMULARIO DE CONTACTO CON EMAILJS ==========
    document.getElementById('form-contacto').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Enviando...';
    
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value || 'No proporcionado', // Sin acento
            asunto: document.getElementById('asunto').value,
            mensaje: document.getElementById('mensaje').value,
            fecha: new Date().toLocaleString('es-CL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    
        emailjs.send('service_v4t29fv', 'template_z6ythfa', formData)
            .then(() => {
                document.getElementById('mensaje-exito').classList.remove('d-none');
                this.reset();
            })
            .catch((error) => {
                console.error('Error detallado:', error);
                document.getElementById('mensaje-error').classList.remove('d-none');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Enviar mensaje';
            });
    });
});