# Adrenalina Extrema - Backend

Backend API para el sistema de gestión de entrenamiento Adrenalina Extrema.

## Estructura del Proyecto

```
backend/
├── server.js           # Punto de entrada del servidor
├── package.json        # Dependencias del proyecto
├── .env.example        # Variables de entorno (template)
├── .gitignore         # Archivos ignorados por git
├── config/            # Configuración (DB, etc)
├── controllers/       # Lógica de negocio
├── models/           # Modelos de datos
├── routes/           # Rutas de la API
├── middleware/       # Middleware personalizado
└── utils/            # Funciones utilitarias
```

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia `.env.example` a `.env`
2. Configura las variables de entorno según tu entorno

## Uso

Desarrollo:
```bash
npm run dev
```

Producción:
```bash
npm start
```

## API Endpoints

### Estudiantes
- `GET /api/students` - Listar todos los estudiantes
- `GET /api/students/:id` - Obtener un estudiante
- `POST /api/students` - Crear estudiante
- `PUT /api/students/:id` - Actualizar estudiante
- `DELETE /api/students/:id` - Eliminar estudiante

### Rutinas
- `GET /api/routines` - Listar todas las rutinas
- `GET /api/routines/:id` - Obtener una rutina
- `POST /api/routines` - Crear rutina
- `PUT /api/routines/:id` - Actualizar rutina
- `DELETE /api/routines/:id` - Eliminar rutina

### Ejercicios
- `GET /api/exercises` - Listar todos los ejercicios
- `GET /api/exercises/:id` - Obtener un ejercicio
- `POST /api/exercises` - Crear ejercicio
- `PUT /api/exercises/:id` - Actualizar ejercicio
- `DELETE /api/exercises/:id` - Eliminar ejercicio
