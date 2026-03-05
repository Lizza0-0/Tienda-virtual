/* ============================================================
   apiService.js  —  Módulo central de comunicación con la API
   Todos los métodos HTTP del proyecto pasan por aquí.
   ============================================================ */

const API_BASE_URL = "http://localhost:3000/api";

/* ---------- utilidad privada ---------- */
const buildHeaders = () => ({
  "Content-Type": "application/json",
});

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error en la solicitud");
  }
  return data;
};

/* ---------- AUTH ---------- */
const authService = {
  login: async (usuario, contrasena) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ usuario, contrasena }),
    });
    return handleResponse(response);
  },
};

/* ---------- USUARIOS ---------- */
const usuariosService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      headers: buildHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      headers: buildHeaders(),
    });
    return handleResponse(response);
  },

  create: async (usuarioData) => {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(usuarioData),
    });
    return handleResponse(response);
  },

  update: async (id, usuarioData) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(usuarioData),
    });
    return handleResponse(response);
  },

  remove: async (id) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return handleResponse(response);
  },
};

/* ---------- PRODUCTOS ---------- */
const productosService = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      headers: buildHeaders(),
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      headers: buildHeaders(),
    });
    return handleResponse(response);
  },

  create: async (productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(productoData),
    });
    return handleResponse(response);
  },

  update: async (id, productoData) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(productoData),
    });
    return handleResponse(response);
  },

  remove: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return handleResponse(response);
  },
};
