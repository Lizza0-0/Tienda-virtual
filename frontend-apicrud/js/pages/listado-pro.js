sessionService.protegerPagina();

const usuarioActivo          = sessionService.obtener();
const rolActivo              = usuarioActivo?.rol ?? '';
const tablaProductos         = document.getElementById('tablaProductos');
const inputBuscador          = document.getElementById('inputBuscador');
const alertaMensaje          = document.getElementById('alertaMensaje');
const textoAlerta            = document.getElementById('textoAlerta');
const nombreProductoEliminar = document.getElementById('nombreProductoEliminar');
const btnConfirmarEliminar   = document.getElementById('btnConfirmarEliminar');
const nombreUsuarioTopbar    = document.getElementById('nombreUsuarioTopbar');
const btnLogout              = document.getElementById('btnLogout');

let listaProductos     = [];
let productoIdEliminar = null;

nombreUsuarioTopbar.textContent = usuarioActivo?.usuario ?? 'Usuario';

btnLogout.addEventListener('click', () => {
  sessionService.cerrar();
  window.location.href = 'login.html';
});

const mostrarAlerta = (mensaje, tipo = 'success') => {
  textoAlerta.textContent = mensaje;
  alertaMensaje.className = `alert alert-${tipo} mb-3`;
  alertaMensaje.classList.remove('d-none');
  setTimeout(() => alertaMensaje.classList.add('d-none'), 3500);
};

const formatearPrecio = (valor) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);

const crearFilaProducto = (producto) => {
  const esVendedor = rolActivo === 'vendedor';
  const fila       = document.createElement('tr');
  fila.dataset.nombre = producto.nombre.toLowerCase();

  const btnEliminar = esVendedor
    ? `<button class="btn btn-sm btn-secondary" disabled title="Sin permiso">
         <i class="fas fa-ban"></i>
       </button>`
    : `<button class="btn btn-sm btn-danger btn-eliminar"
         data-id="${producto.id}" data-nombre="${producto.nombre}">
         <i class="fas fa-trash"></i>
       </button>`;

  fila.innerHTML = `
    <td>${producto.id}</td>
    <td><strong>${producto.nombre}</strong></td>
    <td>${producto.descripcion || '—'}</td>
    <td>${formatearPrecio(producto.precio)}</td>
    <td>
      <span class="badge badge-${producto.stock > 0 ? 'success' : 'danger'}">
        ${producto.stock}
      </span>
    </td>
    <td>
      ${producto.imagen
        ? `<img src="${producto.imagen}" alt="${producto.nombre}"
               style="width:50px;height:50px;object-fit:cover;border-radius:6px;" />`
        : '<span class="text-muted small">Sin imagen</span>'}
    </td>
    <td>
      <a href="editar-pro.html?id=${producto.id}" class="btn btn-sm btn-warning mr-1">
        <i class="fas fa-edit"></i>
      </a>
      ${btnEliminar}
    </td>
  `;

  if (!esVendedor) {
    fila.querySelector('.btn-eliminar').addEventListener('click', (e) => {
      const btn = e.currentTarget;
      productoIdEliminar        = btn.dataset.id;
      nombreProductoEliminar.textContent = btn.dataset.nombre;
      $('#modalEliminar').modal('show');
    });
  }

  return fila;
};

const renderizarProductos = (productos) => {
  tablaProductos.innerHTML = '';

  if (!productos.length) {
    tablaProductos.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-4 text-muted">
          <i class="fas fa-box-open fa-2x mb-2 d-block"></i>
          No se encontraron productos.
        </td>
      </tr>`;
    return;
  }

  productos.forEach((p) => tablaProductos.appendChild(crearFilaProducto(p)));
};

const cargarProductos = async () => {
  try {
    listaProductos = await productosService.getAll();
    renderizarProductos(listaProductos);
  } catch (error) {
    tablaProductos.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger py-4">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Error al cargar productos: ${error.message}
        </td>
      </tr>`;
  }
};

inputBuscador.addEventListener('input', () => {
  const termino  = inputBuscador.value.trim().toLowerCase();
  const filtrados = listaProductos.filter((p) =>
    p.nombre.toLowerCase().includes(termino)
  );
  renderizarProductos(filtrados);
});

btnConfirmarEliminar.addEventListener('click', async () => {
  if (!productoIdEliminar) return;

  btnConfirmarEliminar.disabled     = true;
  btnConfirmarEliminar.innerHTML    = '<i class="fas fa-spinner fa-spin mr-1"></i> Eliminando...';

  try {
    await productosService.remove(productoIdEliminar);
    $('#modalEliminar').modal('hide');
    mostrarAlerta('Producto eliminado exitosamente.');
    await cargarProductos();
  } catch (error) {
    mostrarAlerta(`Error al eliminar: ${error.message}`, 'danger');
  } finally {
    btnConfirmarEliminar.disabled  = false;
    btnConfirmarEliminar.innerHTML = '<i class="fas fa-trash mr-1"></i> Eliminar';
    productoIdEliminar             = null;
  }
});

cargarProductos();
