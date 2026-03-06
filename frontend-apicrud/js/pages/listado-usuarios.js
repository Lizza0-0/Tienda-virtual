sessionService.protegerPagina();

const usuarioActivo         = sessionService.obtener();
const tablaUsuarios         = document.getElementById('tablaUsuarios');
const inputBuscador         = document.getElementById('inputBuscador');
const alertaMensaje         = document.getElementById('alertaMensaje');
const textoAlerta           = document.getElementById('textoAlerta');
const nombreUsuarioEliminar = document.getElementById('nombreUsuarioEliminar');
const btnConfirmarEliminar  = document.getElementById('btnConfirmarEliminar');
const nombreUsuarioTopbar   = document.getElementById('nombreUsuarioTopbar');
const btnLogout             = document.getElementById('btnLogout');

let listaUsuarios     = [];
let usuarioIdEliminar = null;

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

const getBadgeRol = (rol) => {
  const colores = { administrador: 'primary', vendedor: 'success', cajero: 'info' };
  return `<span class="badge badge-${colores[rol] ?? 'secondary'}">${rol}</span>`;
};

const crearFilaUsuario = (usuario) => {
  const fila = document.createElement('tr');
  fila.dataset.nombre = usuario.usuario.toLowerCase();

  fila.innerHTML = `
    <td>${usuario.id}</td>
    <td><i class="fas fa-user-circle mr-2 text-gray-400"></i>${usuario.usuario}</td>
    <td>${getBadgeRol(usuario.rol)}</td>
    <td>
      <button class="btn btn-sm btn-danger btn-eliminar"
        data-id="${usuario.id}" data-nombre="${usuario.usuario}">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  `;

  fila.querySelector('.btn-eliminar').addEventListener('click', (e) => {
    const btn = e.currentTarget;
    usuarioIdEliminar                   = btn.dataset.id;
    nombreUsuarioEliminar.textContent   = btn.dataset.nombre;
    $('#modalEliminar').modal('show');
  });

  return fila;
};

const renderizarUsuarios = (usuarios) => {
  tablaUsuarios.innerHTML = '';

  if (!usuarios.length) {
    tablaUsuarios.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4 text-muted">
          <i class="fas fa-users-slash fa-2x mb-2 d-block"></i>
          No se encontraron usuarios.
        </td>
      </tr>`;
    return;
  }

  usuarios.forEach((u) => tablaUsuarios.appendChild(crearFilaUsuario(u)));
};

const cargarUsuarios = async () => {
  try {
    listaUsuarios = await usuariosService.getAll();
    renderizarUsuarios(listaUsuarios);
  } catch (error) {
    tablaUsuarios.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-danger py-4">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Error al cargar usuarios: ${error.message}
        </td>
      </tr>`;
  }
};

inputBuscador.addEventListener('input', () => {
  const termino  = inputBuscador.value.trim().toLowerCase();
  const filtrados = listaUsuarios.filter((u) =>
    u.usuario.toLowerCase().includes(termino)
  );
  renderizarUsuarios(filtrados);
});

btnConfirmarEliminar.addEventListener('click', async () => {
  if (!usuarioIdEliminar) return;

  btnConfirmarEliminar.disabled  = true;
  btnConfirmarEliminar.innerHTML = '<i class="fas fa-spinner fa-spin mr-1"></i> Eliminando...';

  try {
    await usuariosService.remove(usuarioIdEliminar);
    $('#modalEliminar').modal('hide');
    mostrarAlerta('Usuario eliminado exitosamente.');
    await cargarUsuarios();
  } catch (error) {
    mostrarAlerta(`Error al eliminar: ${error.message}`, 'danger');
  } finally {
    btnConfirmarEliminar.disabled  = false;
    btnConfirmarEliminar.innerHTML = '<i class="fas fa-trash mr-1"></i> Eliminar';
    usuarioIdEliminar              = null;
  }
});

cargarUsuarios();
