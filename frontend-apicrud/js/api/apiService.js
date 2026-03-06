const apiBaseUrl = 'http://localhost:3000/api';

const buildHeaders = () => ({ 'Content-Type': 'application/json' });

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Error en la solicitud');
  return data;
};

const authService = {
  login: (usuario, contrasena) =>
    fetch(`${apiBaseUrl}/login`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify({ usuario, contrasena }),
    }).then(handleResponse),
};

const usuariosService = {
  getAll: () =>
    fetch(`${apiBaseUrl}/usuarios`, { headers: buildHeaders() }).then(handleResponse),

  getById: (id) =>
    fetch(`${apiBaseUrl}/usuarios/${id}`, { headers: buildHeaders() }).then(handleResponse),

  create: (data) =>
    fetch(`${apiBaseUrl}/usuarios`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${apiBaseUrl}/usuarios/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  remove: (id) =>
    fetch(`${apiBaseUrl}/usuarios/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }).then(handleResponse),
};

const productosService = {
  getAll: () =>
    fetch(`${apiBaseUrl}/productos`, { headers: buildHeaders() }).then(handleResponse),

  getById: (id) =>
    fetch(`${apiBaseUrl}/productos/${id}`, { headers: buildHeaders() }).then(handleResponse),

  create: (data) =>
    fetch(`${apiBaseUrl}/productos`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  update: (id, data) =>
    fetch(`${apiBaseUrl}/productos/${id}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(data),
    }).then(handleResponse),

  remove: (id) =>
    fetch(`${apiBaseUrl}/productos/${id}`, {
      method: 'DELETE',
      headers: buildHeaders(),
    }).then(handleResponse),
};
