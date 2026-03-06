const sessionKey = 'usuarioSesion';

const sessionService = {
  guardar: (data) => localStorage.setItem(sessionKey, JSON.stringify(data)),
  obtener: () => JSON.parse(localStorage.getItem(sessionKey)),
  cerrar: () => localStorage.removeItem(sessionKey),
  estaActivo: () => !!localStorage.getItem(sessionKey),
  obtenerRol: () => sessionService.obtener()?.rol ?? null,
  protegerPagina: () => {
    if (!sessionService.estaActivo()) window.location.href = 'login.html';
  },
};
