sessionService.protegerPagina();

const usuarioActivo            = sessionService.obtener();
const formularioUsuario        = document.getElementById('formularioUsuario');
const selectRol                = document.getElementById('selectRol');
const inputUsuario             = document.getElementById('inputUsuario');
const inputContrasena          = document.getElementById('inputContrasena');
const inputConfirmarContrasena = document.getElementById('inputConfirmarContrasena');
const alertaError              = document.getElementById('alertaError');
const alertaExito              = document.getElementById('alertaExito');
const mensajeError             = document.getElementById('mensajeError');
const mensajeExito             = document.getElementById('mensajeExito');
const btnCrear                 = document.getElementById('btnCrear');
const textoBtn                 = document.getElementById('textoBtn');
const loadingBtn               = document.getElementById('loadingBtn');
const nombreUsuarioTopbar      = document.getElementById('nombreUsuarioTopbar');
const btnLogout                = document.getElementById('btnLogout');

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

formularioUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertaError.classList.add('d-none');
  alertaExito.classList.add('d-none');

  const rol                 = selectRol.value.trim();
  const usuario             = inputUsuario.value.trim();
  const contrasena          = inputContrasena.value.trim();
  const confirmarContrasena = inputConfirmarContrasena.value.trim();

  if (!rol || !usuario || !contrasena || !confirmarContrasena) {
    mostrarError('Todos los campos son obligatorios.');
    return;
  }
  if (contrasena !== confirmarContrasena) {
    mostrarError('Las contraseñas no coinciden.');
    return;
  }
  if (contrasena.length < 4) {
    mostrarError('La contraseña debe tener al menos 4 caracteres.');
    return;
  }

  toggleLoading(true);

  try {
    await usuariosService.create({ rol, usuario, contrasena });
    mostrarExito('¡Usuario creado! Redirigiendo...');
    formularioUsuario.reset();
    setTimeout(() => { window.location.href = 'listado-usuarios.html'; }, 2000);
  } catch (error) {
    mostrarError(error.message || 'Error al crear el usuario.');
  } finally {
    toggleLoading(false);
  }
});
