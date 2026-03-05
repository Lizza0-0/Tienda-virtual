/* ============================================================
   sessionService.js  —  Gestión de sesión del usuario
   Guarda y lee el usuario logueado desde localStorage.
   ============================================================ */

const SESSION_KEY = "usuarioSesion";

const sessionService = {
  /* Guarda el usuario tras un login exitoso */
  guardar: (usuarioData) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(usuarioData));
  },

  /* Retorna el objeto del usuario o null si no hay sesión */
  obtener: () => {
    const datos = localStorage.getItem(SESSION_KEY);
    return datos ? JSON.parse(datos) : null;
  },

  /* Elimina la sesión (logout) */
  cerrar: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  /* Retorna true si hay un usuario activo */
  estaActivo: () => {
    return localStorage.getItem(SESSION_KEY) !== null;
  },

  /* Retorna el rol del usuario activo o null */
  obtenerRol: () => {
    const usuario = sessionService.obtener();
    return usuario ? usuario.rol : null;
  },

  /* Redirige al login si no hay sesión activa */
  protegerPagina: () => {
    if (!sessionService.estaActivo()) {
      window.location.href = "login.html";
    }
  },
};
