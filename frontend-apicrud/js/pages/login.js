if (sessionService.estaActivo()) window.location.href = 'index.html';

const formularioLogin = document.getElementById('formularioLogin');
const inputUsuario    = document.getElementById('inputUsuario');
const inputContrasena = document.getElementById('inputContrasena');
const alertaError     = document.getElementById('alertaError');
const mensajeError    = document.getElementById('mensajeError');
const btnLogin        = document.getElementById('btnLogin');
const textoBtn        = document.getElementById('textoBtn');
const loadingBtn      = document.getElementById('loadingBtn');

const toggleLoading = (activo) => {
  btnLogin.disabled = activo;
  textoBtn.classList.toggle('d-none', activo);
  loadingBtn.classList.toggle('d-none', !activo);
};

const mostrarError = (mensaje) => {
  mensajeError.textContent = mensaje;
  alertaError.classList.remove('d-none');
};

formularioLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  alertaError.classList.add('d-none');

  const usuario    = inputUsuario.value.trim();
  const contrasena = inputContrasena.value.trim();

  if (!usuario || !contrasena) {
    mostrarError('Por favor completa todos los campos.');
    return;
  }

  toggleLoading(true);

  try {
    const data = await authService.login(usuario, contrasena);
    sessionService.guardar(data);
    window.location.href = 'index.html';
  } catch (error) {
    mostrarError(error.message || 'Credenciales incorrectas.');
  } finally {
    toggleLoading(false);
  }
});
