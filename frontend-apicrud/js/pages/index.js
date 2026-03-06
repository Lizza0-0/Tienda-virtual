sessionService.protegerPagina();

const usuarioActivo       = sessionService.obtener();
const nombreUsuarioTopbar = document.getElementById('nombreUsuarioTopbar');
const badgeRol            = document.getElementById('badgeRol');
const rolUsuario          = document.getElementById('rolUsuario');
const nombreSesion        = document.getElementById('nombreSesion');
const contadorProductos   = document.getElementById('contadorProductos');
const contadorUsuarios    = document.getElementById('contadorUsuarios');
const btnLogout           = document.getElementById('btnLogout');

nombreUsuarioTopbar.textContent = usuarioActivo?.usuario ?? 'Usuario';
badgeRol.textContent            = usuarioActivo?.rol ?? '';
rolUsuario.textContent          = usuarioActivo?.rol ?? '—';
nombreSesion.textContent        = usuarioActivo?.usuario ?? '—';

btnLogout.addEventListener('click', () => {
  sessionService.cerrar();
  window.location.href = 'login.html';
});

const cargarContadores = async () => {
  try {
    const productos = await productosService.getAll();
    contadorProductos.textContent = productos.length;
  } catch {
    contadorProductos.textContent = '—';
  }

  try {
    const usuarios = await usuariosService.getAll();
    contadorUsuarios.textContent = usuarios.length;
  } catch {
    contadorUsuarios.textContent = '—';
  }
};

cargarContadores();
