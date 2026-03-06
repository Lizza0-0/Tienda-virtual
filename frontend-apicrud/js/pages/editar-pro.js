sessionService.protegerPagina();

const usuarioActivo        = sessionService.obtener();
const params               = new URLSearchParams(window.location.search);
const productoId           = params.get('id');
const formularioEditar     = document.getElementById('formularioEditar');
const inputNombre          = document.getElementById('inputNombre');
const inputDescripcion     = document.getElementById('inputDescripcion');
const inputPrecio          = document.getElementById('inputPrecio');
const inputStock           = document.getElementById('inputStock');
const inputImagen          = document.getElementById('inputImagen');
const previsualizacion     = document.getElementById('previsualizacionImagen');
const alertaError          = document.getElementById('alertaError');
const alertaExito          = document.getElementById('alertaExito');
const mensajeError         = document.getElementById('mensajeError');
const mensajeExito         = document.getElementById('mensajeExito');
const btnGuardar           = document.getElementById('btnGuardar');
const textoBtn             = document.getElementById('textoBtn');
const loadingBtn           = document.getElementById('loadingBtn');
const contenedorCarga      = document.getElementById('contenedorCarga');
const contenedorFormulario = document.getElementById('contenedorFormulario');
const nombreUsuarioTopbar  = document.getElementById('nombreUsuarioTopbar');
const btnLogout            = document.getElementById('btnLogout');

nombreUsuarioTopbar.textContent = usuarioActivo?.usuario ?? 'Usuario';

btnLogout.addEventListener('click', () => {
  sessionService.cerrar();
  window.location.href = 'login.html';
});

const toggleLoading = (activo) => {
  btnGuardar.disabled = activo;
  textoBtn.classList.toggle('d-none', activo);
  loadingBtn.classList.toggle('d-none', !activo);
};

const mostrarError = (mensaje) => {
  mensajeError.textContent = mensaje;
  alertaError.classList.remove('d-none');
  alertaExito.classList.add('d-none');
};

const mostrarExito = (mensaje) => {
  mensajeExito.textContent = mensaje;
  alertaExito.classList.remove('d-none');
  alertaError.classList.add('d-none');
};

inputImagen.addEventListener('input', () => {
  const url = inputImagen.value.trim();
  previsualizacion.src     = url || 'https://via.placeholder.com/300x250?text=Sin+imagen';
  previsualizacion.onerror = () => {
    previsualizacion.src = 'https://via.placeholder.com/300x250?text=URL+no+válida';
  };
});

const cargarProducto = async () => {
  if (!productoId) {
    contenedorCarga.innerHTML = `
      <div class="alert alert-danger">
        No se especificó un producto. <a href="listado-pro.html">Volver al listado</a>.
      </div>`;
    return;
  }

  try {
    const producto         = await productosService.getById(productoId);
    inputNombre.value      = producto.nombre;
    inputDescripcion.value = producto.descripcion ?? '';
    inputPrecio.value      = producto.precio;
    inputStock.value       = producto.stock;
    inputImagen.value      = producto.imagen ?? '';

    if (producto.imagen) previsualizacion.src = producto.imagen;

    contenedorCarga.classList.add('d-none');
    contenedorFormulario.classList.remove('d-none');
  } catch (error) {
    contenedorCarga.innerHTML = `
      <div class="alert alert-danger">
        Error al cargar el producto: ${error.message}.
        <a href="listado-pro.html">Volver al listado</a>.
      </div>`;
  }
};

formularioEditar.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertaError.classList.add('d-none');
  alertaExito.classList.add('d-none');

  const productoActualizado = {
    nombre:      inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    precio:      parseFloat(inputPrecio.value),
    stock:       parseInt(inputStock.value, 10),
    imagen:      inputImagen.value.trim(),
  };

  if (!productoActualizado.nombre) {
    mostrarError('El nombre del producto es obligatorio.');
    return;
  }
  if (isNaN(productoActualizado.precio) || productoActualizado.precio < 0) {
    mostrarError('El precio debe ser un número válido.');
    return;
  }

  toggleLoading(true);

  try {
    await productosService.update(productoId, productoActualizado);
    mostrarExito('¡Producto actualizado! Redirigiendo...');
    setTimeout(() => { window.location.href = 'listado-pro.html'; }, 2000);
  } catch (error) {
    mostrarError(error.message || 'Error al actualizar el producto.');
  } finally {
    toggleLoading(false);
  }
});

cargarProducto();
