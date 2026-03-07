# Script de Actualización - Migración Completa

Este documento describe los cambios realizados y los pasos para aplicarlos.

## Cambios Implementados

### 1. ✅ Mejora de Botones Flotantes
- Los botones "+" ahora muestran siempre el texto descriptivo
- "Agregar Ejercicio" en la vista de rutinas
- "Agregar Alumno" en la vista de alumnos

### 2. ✅ Reestructuración de Ejercicios
**Cambio conceptual importante:**
- Los ejercicios ahora solo almacenan: nombre y tipo (reps o segundos)
- Las cantidades específicas (sets, reps/segundos) se asignan al agregar el ejercicio a una rutina
- Esto permite reutilizar ejercicios con diferentes intensidades

**Cambios en la base de datos:**
- Tabla `ejercicio`: eliminados `cantSets` y `contador`, agregado `tipoContador` (ENUM: 'reps', 'segundos')
- Tabla `rutina_ejercicio`: agregados `cantSets`, `cantidad` y `orden`

### 3. ✅ Hash de Contraseñas con bcrypt
- Implementado bcrypt para hashear contraseñas en el backend
- Nuevo endpoint `/api/personas/login` para autenticación segura
- Campo `password` ampliado de VARCHAR(45) a VARCHAR(255)

### 4. ✅ Margen Inferior en Vistas
- Aumentado padding-bottom de `pb-24` a `pb-32` en todas las vistas móviles
- Evita que el menú inferior tape el contenido

## Pasos para Aplicar los Cambios

### 1. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 2. Aplicar Migraciones de Base de Datos

**IMPORTANTE: Ejecutar en este orden**

```bash
# En MySQL Workbench o tu cliente SQL preferido:

# 1. Actualizar estructura de ejercicios y rutina_ejercicio
source backend/migracion_ejercicios.sql

# 2. Actualizar campo password
source backend/migracion_password_hash.sql
```

**Nota:** Si tienes datos existentes:
- Los ejercicios perderán sus cantidades predefinidas (deberás reasignarlas al crear rutinas)
- Las contraseñas existentes NO funcionarán (necesitarás recrear usuarios o actualizar manualmente)

### 3. Reiniciar el Backend
```bash
cd backend
npm run dev
```

### 4. Actualizar el Frontend (si es necesario)
```bash
cd frontend
npm install  # Por si acaso hay cambios
npm run dev
```

## Archivos Modificados

### Backend
- `package.json` - Agregado bcrypt
- `models/Ejercicio.js` - Actualizado para nueva estructura
- `models/Rutina.js` - Agregados métodos para manejar sets/cantidad en rutina_ejercicio
- `models/Persona.js` - Implementado hash de contraseñas con bcrypt
- `controllers/personaController.js` - Agregado endpoint de login
- `controllers/rutinaController.js` - Actualizado para nueva estructura
- `routes/personas.js` - Agregada ruta de login

### Frontend
- `views/AddExercise.jsx` - Simplificado para solo pedir nombre y tipo
- `views/RoutineBuilder.jsx` - Margen aumentado y botón mejorado
- `views/StudentList.jsx` - Margen aumentado y botón mejorado
- `views/StudentDetail.jsx` - Margen aumentado
- `views/Profile.jsx` - Margen aumentado
- `context/AppContext.jsx` - Actualizado para nueva estructura de datos
- `services/api.js` - Actualizado endpoint de login y addEjercicio

### Migraciones SQL
- `backend/migracion_ejercicios.sql` - NEW
- `backend/migracion_password_hash.sql` - NEW

## Testing Recomendado

1. **Crear nuevo usuario:** Verificar que la contraseña se hashea correctamente
2. **Login:** Verificar que el login funciona con contraseñas hasheadas
3. **Crear ejercicio:** Solo debe pedir nombre y tipo (reps/segundos)
4. **Crear rutina:** Al agregar ejercicios, debe permitir especificar sets y cantidad
5. **Verificar márgenes:** Revisar que los botones no quedan tapados por el menú inferior

## Notas Importantes

- **Seguridad:** Las contraseñas ahora están hasheadas con bcrypt (salt rounds: 10)
- **Compatibilidad:** Los datos existentes necesitarán migración manual
- **Performance:** El hash de contraseñas es computacionalmente costoso, pero necesario para seguridad
