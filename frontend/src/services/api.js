// API Service para conectar con el backend
const API_BASE_URL = 'http://localhost:3000/api'

// Helper para hacer peticiones HTTP
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json()
      // Si es un error de email no verificado, lanzar un error con información adicional
      if (errorData.errorCode === 'EMAIL_NOT_VERIFIED') {
        const error = new Error(errorData.error || 'Email no verificado')
        error.code = 'EMAIL_NOT_VERIFIED'
        error.email = errorData.email
        error.nombre = errorData.nombre
        throw error
      }
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ========== PERSONAS ==========

export const personasAPI = {
  // Obtener todas las personas
  getAll: () => fetchAPI('/personas'),

  // Obtener persona por ID
  getById: (id) => fetchAPI(`/personas/${id}`),

  // Obtener personas por rol (alumno, entrenador, admin)
  getByRol: (rol) => fetchAPI(`/personas/rol/${rol}`),

  // Obtener rutinas de una persona
  getRutinas: (id) => fetchAPI(`/personas/${id}/rutinas`),

  // Crear persona
  create: (persona) => fetchAPI('/personas', {
    method: 'POST',
    body: JSON.stringify(persona),
  }),

  // Actualizar persona
  update: (id, data) => fetchAPI(`/personas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Eliminar persona
  delete: (id) => fetchAPI(`/personas/${id}`, {
    method: 'DELETE',
  }),

  // Login (autenticación con contraseñas hasheadas)
  login: async (email, password) => {
    return fetchAPI('/personas/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Registro de alumno (con reclamación de cuenta si existe sin password)
  register: async (data) => {
    return fetchAPI('/personas/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// ========== PROFESORA ==========

export const profesoraAPI = {
  // Obtener alumnos con paginación ordenados por última asignación
  getAlumnosPaginados: (page = 1, limit = 10) => 
    fetchAPI(`/profesora/alumnos?page=${page}&limit=${limit}`)
}

// ========== EJERCICIOS ==========

export const ejerciciosAPI = {
  // Obtener todos los ejercicios
  getAll: () => fetchAPI('/ejercicios'),

  // Obtener ejercicio por ID
  getById: (id) => fetchAPI(`/ejercicios/${id}`),

  // Buscar ejercicios por nombre
  searchByName: (nombre) => fetchAPI(`/ejercicios/search/${nombre}`),

  // Obtener rutinas que incluyen un ejercicio
  getRutinas: (id) => fetchAPI(`/ejercicios/${id}/rutinas`),

  // Crear ejercicio
  create: (ejercicio) => fetchAPI('/ejercicios', {
    method: 'POST',
    body: JSON.stringify(ejercicio),
  }),

  // Actualizar ejercicio
  update: (id, data) => fetchAPI(`/ejercicios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Eliminar ejercicio
  delete: (id) => fetchAPI(`/ejercicios/${id}`, {
    method: 'DELETE',
  }),
}

// ========== RUTINAS ==========

export const rutinasAPI = {
  // Obtener todas las rutinas
  getAll: () => fetchAPI('/rutinas'),

  // Obtener rutina por ID
  getById: (id) => fetchAPI(`/rutinas/${id}`),

  // Obtener rutina completa con ejercicios
  getFull: (id) => fetchAPI(`/rutinas/${id}/full`),

  // Obtener ejercicios de una rutina
  getEjercicios: (id) => fetchAPI(`/rutinas/${id}/ejercicios`),

  // Obtener alumnos con esta rutina asignada
  getAlumnos: (id) => fetchAPI(`/rutinas/${id}/alumnos`),

  // Crear rutina
  create: (rutina) => fetchAPI('/rutinas', {
    method: 'POST',
    body: JSON.stringify(rutina),
  }),

  // Actualizar rutina
  update: (id, data) => fetchAPI(`/rutinas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Eliminar rutina
  delete: (id) => fetchAPI(`/rutinas/${id}`, {
    method: 'DELETE',
  }),

  // Asignar rutina a persona
  assignToPersona: (rutinaId, personaId) => fetchAPI(`/rutinas/${rutinaId}/asignar`, {
    method: 'POST',
    body: JSON.stringify({ idPersona: personaId }),
  }),

  // Desasignar rutina de persona
  removeFromPersona: (rutinaId, personaId, fechaAsignacion) => fetchAPI(`/rutinas/${rutinaId}/desasignar`, {
    method: 'POST',
    body: JSON.stringify({ idPersona: personaId, fechaAsignacion }),
  }),

  // Actualizar estado de asignación de rutina
  updateEstado: (rutinaId, personaId, estado, fechaAsignacion) => fetchAPI(`/rutinas/${rutinaId}/estado`, {
    method: 'PUT',
    body: JSON.stringify({ idPersona: personaId, estado, fechaAsignacion }),
  }),

  // Agregar ejercicio a rutina
  addEjercicio: (rutinaId, ejercicioData) => fetchAPI(`/rutinas/${rutinaId}/ejercicios`, {
    method: 'POST',
    body: JSON.stringify(ejercicioData),
  }),

  // Eliminar ejercicio de rutina
  removeEjercicio: (rutinaId, ejercicioId) => fetchAPI(`/rutinas/${rutinaId}/ejercicios/${ejercicioId}`, {
    method: 'DELETE',
  }),
}

// ========== TIPOS DE EJERCICIO ==========

export const tiposEjercicioAPI = {
  // Obtener todos los tipos
  getAll: () => fetchAPI('/tipos-ejercicio'),

  // Obtener tipo por ID
  getById: (id) => fetchAPI(`/tipos-ejercicio/${id}`),

  // Crear tipo
  create: (tipo) => fetchAPI('/tipos-ejercicio', {
    method: 'POST',
    body: JSON.stringify(tipo),
  }),

  // Actualizar tipo
  update: (id, data) => fetchAPI(`/tipos-ejercicio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Eliminar tipo
  delete: (id) => fetchAPI(`/tipos-ejercicio/${id}`, {
    method: 'DELETE',
  }),
}

export default {
  personas: personasAPI,
  ejercicios: ejerciciosAPI,
  rutinas: rutinasAPI,
  tiposEjercicio: tiposEjercicioAPI,
}
