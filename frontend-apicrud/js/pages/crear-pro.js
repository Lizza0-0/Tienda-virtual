sessionService.protegerPagina();

const usuarioActivo          = sessionService.obtener();
const formularioProducto     = document.getElementById('formularioProducto');
const inputNombre            = document.getElementById('inputNombre');
const inputDescripcion       = document.getElementById('inputDescripcion');
const inputPrecio            = document.getElementById('inputPrecio');
const inputStock             = document.getElementById('inputStock');
const inputImagen            = document.getElementById('inputImagen');
const previsualizacion       = document.getElementById('previsualizacionImagen');
const alertaError            = document.getElementById('alertaError');
const alertaExito            = document.getElementById('alertaExito');
const mensajeError           = document.getElementById('mensajeError');
const mensajeExito           = document.getElementById('mensajeExito');
const btnCrear               = document.getElementById('btnCrear');
const textoBtn               = document.getElementById('textoBtn');
const loadingBtn             = document.getElementById('loadingBtn');
const nombreUsuarioTopbar    = document.getElementById('nombreUsuarioTopbar');
const btnLogout              = document.getElementById('btnLogout');

const placeholderImg = 'https://via.placeholder.com/300x250?text=Sin+imagen';

nombreUsuarioTopbar.textContent = usuarioActivo?.usuario ?? 'Usuario';

btnLogout.addEventListener('click', () => {
  sessionService.cerrar();
  window.location.href = 'login.html';
});

const toggleLoading = (activo) => {
  btnCrear.disabled = activo;
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
  previsualizacion.src    = url || placeholderImg;
  previsualizacion.onerror = () => {
    previsualizacion.src = 'https://via.placeholder.com/300x250?text=URL+no+válida';
  };
});

formularioProducto.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertaError.classList.add('d-none');
  alertaExito.classList.add('d-none');

  const nuevoProducto = {
    nombre:      inputNombre.value.trim(),
    descripcion: inputDescripcion.value.trim(),
    precio:      parseFloat(inputPrecio.value),
    stock:       parseInt(inputStock.value, 10),
    imagen:      inputImagen.value.trim(),
  };

  if (!nuevoProducto.nombre) {
    mostrarError('El nombre del producto es obligatorio.');
    return;
  }
  if (isNaN(nuevoProducto.precio) || nuevoProducto.precio < 0) {
    mostrarError('El precio debe ser un número válido mayor o igual a 0.');
    return;
  }
  if (isNaN(nuevoProducto.stock) || nuevoProducto.stock < 0) {
    mostrarError('El stock debe ser un número válido mayor o igual a 0.');
    return;
  }

  toggleLoading(true);

  try {
    await productosService.create(nuevoProducto);
    mostrarExito('¡Producto creado exitosamente! Redirigiendo...');
    formularioProducto.reset();
    previsualizacion.src = placeholderImg;
    setTimeout(() => { window.location.href = 'listado-pro.html'; }, 2000);
  } catch (error) {
    mostrarError(error.message || 'Error al crear el producto.');
  } finally {
    toggleLoading(false);
  }
});
