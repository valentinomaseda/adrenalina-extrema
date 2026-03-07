# 🚀 Guía de Inicio Rápido

## Requisitos Previos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## Pasos de Instalación

### 1️⃣ Configurar Base de Datos

```bash
# Inicia sesión en MySQL
mysql -u root -p

# Importa el schema (desde la carpeta backend)
source backend/adrenalina_extrema.sql

# O desde fuera de MySQL:
mysql -u root -p < backend/adrenalina_extrema.sql
```

### 2️⃣ Configurar Backend

```bash
# Navega a la carpeta backend
cd backend

# Instala las dependencias
npm install

# Copia el archivo de configuración
cp .env.example .env

# Edita .env con tus credenciales de MySQL
# nano .env  (o usa tu editor favorito)
```

Configura en `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=adrenalina_extrema
DB_USER=root
DB_PASSWORD=tu_password_aqui
```

```bash
# Inicia el servidor backend
npm run dev
```

✅ El backend debería estar corriendo en `http://localhost:3000`

### 3️⃣ Configurar Frontend

```bash
# Navega a la carpeta frontend (desde la raíz)
cd ../frontend

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

✅ El frontend debería estar corriendo en `http://localhost:5173`

## 🧪 Verificar que Todo Funciona

### Test del Backend

Abre tu navegador o usa curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Deberías ver:
# {"status":"ok","timestamp":"..."}
```

### Test del Frontend

Abre tu navegador en `http://localhost:5173` y deberías ver la aplicación.

## 📁 Estructura del Proyecto

```
adrenalina-extrema/
├── frontend/              # Aplicación React (Vite)
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── views/        # Vistas/Páginas
│   │   ├── context/      # Context API
│   │   └── App.jsx       # Componente principal
│   └── package.json
│
└── backend/              # API REST (Express + MySQL)
    ├── server.js         # Servidor Express
    ├── models/           # Modelos de datos
    ├── controllers/      # Lógica de negocio
    ├── routes/           # Rutas API
    ├── middleware/       # Middleware
    ├── config/           # Configuración DB
    └── package.json
```

## 🛠️ Comandos Útiles

### Backend
```bash
cd backend
npm run dev      # Desarrollo con auto-reload
npm start        # Producción
```

### Frontend
```bash
cd frontend
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 📚 Documentación

- **Backend API**: Ver `backend/API_DOCS.md` para documentación completa de endpoints
- **Backend Setup**: Ver `backend/README.md`
- **Frontend**: Ver `frontend/README.md`

## ❓ Problemas Comunes

### Error de conexión MySQL
```
Error: Access denied for user...
```
**Solución**: Verifica tus credenciales en `backend/.env`

### Puerto en uso
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solución**: Cambia el puerto en `backend/.env` o mata el proceso usando el puerto:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill
```

### node_modules falta
```
Error: Cannot find module...
```
**Solución**: Ejecuta `npm install` en las carpetas backend y frontend

## 🎯 Próximos Pasos

1. Prueba crear un alumno desde el frontend
2. Crea algunos ejercicios
3. Arma una rutina y asígnala a un alumno
4. Explora la API con herramientas como Postman o ThunderClient

¡Disfruta desarrollando! 🚀
