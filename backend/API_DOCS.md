# API Endpoints - Adrenalina Extrema

## 🔗 Base URL
```
http://localhost:3000/api
```

## 👤 Personas

### Obtener todas las personas
```http
GET /api/personas
```

### Obtener persona por ID
```http
GET /api/personas/:id
```

### Obtener personas por rol
```http
GET /api/personas/rol/:rol
```
Roles válidos: `alumno`, `entrenador`, `admin`

### Obtener rutinas de una persona
```http
GET /api/personas/:id/rutinas
```

### Crear persona
```http
POST /api/personas
Content-Type: application/json

{
  "idPersona": 1,
  "nombre": "Juan Pérez",
  "mail": "juan@mail.com",
  "tel": 1234567890,
  "rol": "alumno",
  "direccion": "Calle 123",
  "fechaNac": "2000-01-15",
  "peso": 75,
  "altura": 175,
  "password": "password123"
}
```

### Actualizar persona
```http
PUT /api/personas/:id
Content-Type: application/json

{
  "nombre": "Juan Pérez Actualizado",
  "peso": 78
}
```

### Eliminar persona
```http
DELETE /api/personas/:id
```

---

## 🏋️ Ejercicios

### Obtener todos los ejercicios
```http
GET /api/ejercicios
```

### Obtener ejercicio por ID
```http
GET /api/ejercicios/:id
```

### Buscar ejercicios por nombre
```http
GET /api/ejercicios/search/:nombre
```

### Obtener rutinas que incluyen un ejercicio
```http
GET /api/ejercicios/:id/rutinas
```

### Crear ejercicio
```http
POST /api/ejercicios
Content-Type: application/json

{
  "idEjercicio": 1,
  "nombre": "Press de banca",
  "cantSets": 4,
  "contador": "12 reps"
}
```

### Actualizar ejercicio
```http
PUT /api/ejercicios/:id
Content-Type: application/json

{
  "cantSets": 5,
  "contador": "10 reps"
}
```

### Eliminar ejercicio
```http
DELETE /api/ejercicios/:id
```

---

## 📋 Rutinas

### Obtener todas las rutinas
```http
GET /api/rutinas
```

### Obtener rutina por ID
```http
GET /api/rutinas/:id
```

### Obtener rutina completa con ejercicios
```http
GET /api/rutinas/:id/full
```

### Obtener ejercicios de una rutina
```http
GET /api/rutinas/:id/ejercicios
```

### Obtener alumnos con esta rutina asignada
```http
GET /api/rutinas/:id/alumnos
```

### Crear rutina
```http
POST /api/rutinas
Content-Type: application/json

{
  "idRutina": 1,
  "nombre": "Rutina Hipertrofia",
  "fechaHoraCreacion": "2026-03-06 10:00:00"
}
```

### Agregar ejercicio a rutina
```http
POST /api/rutinas/:id/ejercicios
Content-Type: application/json

{
  "idEjercicio": 1
}
```

### Remover ejercicio de rutina
```http
DELETE /api/rutinas/:id/ejercicios/:idEjercicio
```

### Asignar rutina a alumno
```http
POST /api/rutinas/:id/asignar
Content-Type: application/json

{
  "idPersona": 1,
  "estado": "activa"
}
```

### Actualizar estado de rutina asignada
```http
PUT /api/rutinas/:id/estado
Content-Type: application/json

{
  "idPersona": 1,
  "estado": "completada"
}
```

### Actualizar rutina
```http
PUT /api/rutinas/:id
Content-Type: application/json

{
  "nombre": "Rutina Hipertrofia Avanzada"
}
```

### Eliminar rutina
```http
DELETE /api/rutinas/:id
```

---

## 🏷️ Tipos de Ejercicio

### Obtener todos los tipos
```http
GET /api/tipos-ejercicio
```

### Obtener tipo por ID
```http
GET /api/tipos-ejercicio/:id
```

### Crear tipo de ejercicio
```http
POST /api/tipos-ejercicio
Content-Type: application/json

{
  "idTipoEjercicio": 1,
  "nombre": "Pecho"
}
```

### Actualizar tipo de ejercicio
```http
PUT /api/tipos-ejercicio/:id
Content-Type: application/json

{
  "nombre": "Pectorales"
}
```

### Eliminar tipo de ejercicio
```http
DELETE /api/tipos-ejercicio/:id
```

---

## 🔍 Status & Health Check

### Health check
```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-06T18:30:00.000Z"
}
```

### Root
```http
GET /
```

Response:
```json
{
  "message": "API Adrenalina Extrema funcionando"
}
```

---

## 📝 Notas

- Todos los endpoints retornan JSON
- Los IDs deben ser numéricos
- Las fechas deben estar en formato `YYYY-MM-DD` o `YYYY-MM-DD HH:mm:ss`
- Los códigos de estado HTTP usados:
  - `200` - OK
  - `201` - Created
  - `400` - Bad Request
  - `404` - Not Found
  - `500` - Internal Server Error
