# Sistema de Personalización de Rutinas - Guía de Implementación

## 📋 Resumen de Cambios

Se ha implementado un sistema completo de personalización de rutinas que permite al profesor:
- Crear rutinas plantilla con valores base
- Asignar esas rutinas a alumnos **personalizándolas** individualmente
- Modificar sets, cantidad (volumen/intensidad) y agregar especificaciones por ejercicio y por alumno

## 🗄️ Base de Datos

### Nueva Tabla: `alumno_rutina_ejercicio`

Esta tabla almacena los ejercicios personalizados para cada alumno en cada rutina asignada.

**Campos:**
- `idPersona`: ID del alumno
- `idRutina`: ID de la rutina plantilla
- `idEjercicio`: ID del ejercicio
- `cantSets`: Sets personalizados para este alumno
- `cantidad`: Cantidad (reps/segundos) personalizada
- `especificaciones`: Texto libre con indicaciones especiales (ej: "Rápidos el 3, 6 y 12")
- `orden`: Orden del ejercicio en la rutina

### Migración de Base de Datos

**Archivo:** `backend/migracion_personalizacion_rutinas.sql`

Ejecuta este script en tu base de datos MySQL. Incluye dos opciones:

#### OPCIÓN 1: Migración sin pérdida de datos (RECOMENDADO)
```sql
USE `adrenalina_extrema`;
-- Ejecutar desde la línea 1 hasta la línea 55 del script
```

Esta opción:
1. Crea la tabla `alumno_rutina_ejercicio`
2. Migra automáticamente las asignaciones existentes copiando valores de las plantillas
3. Mantiene todos los datos actuales

#### OPCIÓN 2: Reset completo (si quieres empezar de cero)
```sql
-- Descomentar las líneas desde "OPCIÓN 2" en adelante
```

Esta opción elimina y recrea todas las tablas.

### Cómo ejecutar la migración:

**Desde MySQL Workbench:**
1. Abre el archivo `backend/migracion_personalizacion_rutinas.sql`
2. Ejecuta el script completo (Ctrl + Shift + Enter)

**Desde línea de comandos:**
```bash
mysql -u root -p adrenalina_extrema < backend/migracion_personalizacion_rutinas.sql
```

## 🔧 Backend

### Cambios en Modelo (`models/Rutina.js`)

**Métodos nuevos:**
- `assignToAlumno()` - **MODIFICADO**: Ahora asigna la rutina Y copia los ejercicios a la tabla personalizada
- `getAlumnoEjercicios(idRutina, idPersona)` - Obtiene ejercicios personalizados del alumno
- `updateAlumnoEjercicio(idPersona, idRutina, idEjercicio, updates)` - Actualiza ejercicio personalizado
- `addAlumnoEjercicio()` - Agrega ejercicio personalizado
- `removeAlumnoEjercicio()` - Elimina ejercicio personalizado
- `getFullRutinaAlumno()` - Obtiene rutina completa con ejercicios personalizados
- `getAlumnosConPersonalizaciones()` - Lista alumnos con sus personalizaciones

### Nuevos Endpoints (API)

```
GET    /api/rutinas/:id/alumnos-personalizaciones
GET    /api/rutinas/:id/alumnos/:idAlumno/ejercicios
GET    /api/rutinas/:id/alumnos/:idAlumno/full
PUT    /api/rutinas/:id/alumnos/:idAlumno/ejercicios/:idEjercicio
POST   /api/rutinas/:id/alumnos/:idAlumno/ejercicios
DELETE /api/rutinas/:id/alumnos/:idAlumno/ejercicios/:idEjercicio
```

## 🎨 Frontend

### Componentes Nuevos

#### `PersonalizeRoutine.jsx`
Modal que se abre al asignar una rutina. Permite:
- Ver todos los ejercicios de la rutina plantilla
- Modificar sets y cantidad para cada ejercicio
- Agregar especificaciones textuales (ej: "Rápidos el 3, 6 y 12")
- Guardar la rutina personalizada

### Componentes Modificados

#### `StudentDetail.jsx`
- **Antes**: Al asignar rutina, se asignaba directamente
- **Ahora**: Al asignar rutina, se abre el modal `PersonalizeRoutine` primero

#### `StudentRoutines.jsx` (Vista del Alumno)
- Ahora muestra las **especificaciones** debajo de cada ejercicio cuando existen
- Los valores mostrados son los personalizados por el profesor

#### `AppContext.jsx`
- `loadMyRoutines()` - **MODIFICADO**: Ahora usa `getAlumnoEjercicios` en vez de `getEjercicios`
- Los ejercicios incluyen el campo `especificaciones`

#### `api.js` (Servicio)
Añadidos métodos para los nuevos endpoints de personalización.

## 🚀 Flujo de Uso

### Para el Profesor:

1. **Crear Rutina Plantilla** (como siempre)
   - Va a "Rutinas"
   - Crea una rutina con ejercicios
   - Define valores base (ej: 3 sets, 10 reps)

2. **Asignar Rutina a Alumno** (NUEVO FLUJO)
   - Entra al perfil del alumno
   - Selecciona una rutina de la lista
   - Click en "Asignar"
   - **SE ABRE MODAL DE PERSONALIZACIÓN** 🆕
   - Modifica sets/cantidad según el nivel del alumno
   - Agrega especificaciones (ej: "Rápidos el 3, 6 y 12 km")
   - Click en "Asignar Rutina"

### Para el Alumno:

1. **Ver Rutina Personalizada**
   - Va a "Mis Rutinas"
   - Ve los valores personalizados por el profesor
   - Ve las especificaciones si las hay

**Ejemplo de visualización:**
```
🏃 Correr
• 4 sets x 15 km
📝 Especificaciones:
Rápidos el 3, 6 y 12
```

## 🔄 Ejemplo Completo

**Escenario:** Profesor asigna "Cardio Base" a tres alumnos

### Rutina Plantilla: "Cardio Base"
- Correr: 3 sets x 12 km

### Alumno 1: Juan (Nivel Avanzado)
- Correr: **4 sets x 15 km**
- Especificaciones: **"Rápidos el 3, 6 y 12"**

### Alumno 2: María (Nivel Principiante)
- Correr: **2 sets x 8 km**
- Especificaciones: **"Ritmo constante"**

### Alumno 3: Pedro (Nivel Intermedio)
- Correr: **3 sets x 12 km** (valores por defecto)
- Especificaciones: **-**

## ✅ Testing Recomendado

1. **Migrar la base de datos**
   ```bash
   mysql -u root -p adrenalina_extrema < backend/migracion_personalizacion_rutinas.sql
   ```

2. **Reiniciar el backend**
   ```bash
   cd backend
   node server.js
   ```

3. **Reiniciar el frontend**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Probar el flujo completo:**
   - Login como profesor
   - Ir a un alumno
   - Asignar una rutina existente
   - Personalizar los valores en el modal
   - Guardar
   - Logout
   - Login como ese alumno
   - Verificar que ve los valores personalizados

## 📝 Notas Importantes

- Los valores de la **rutina plantilla** NO se modifican
- Cada alumno tiene sus propios valores independientes
- Si el profesor modifica la plantilla, las asignaciones existentes NO se actualizan automáticamente
- Las especificaciones son opcionales (campo TEXT, puede ser NULL)

## 🐛 Troubleshooting

### Error: "Table alumno_rutina_ejercicio doesn't exist"
**Solución:** Ejecutar el script de migración SQL

### Error: "Cannot read property 'especificaciones' of undefined"
**Solución:** Limpiar caché del navegador y recargar

### Los alumnos no ven las personalizaciones
**Solución:** 
1. Verificar que el alumno tiene la rutina asignada DESPUÉS de la migración
2. Si la asignó ANTES de la migración, elimínala y vuelve a asignarla

## 📚 Próximos Pasos (Opcional)

Posibles mejoras futuras:
- Copiar personalizaciones de un alumno a otro
- Historial de cambios en personalizaciones
- Templates de personalización por nivel (principiante/avanzado)
- Editar personalizaciones después de asignar

---

**Fecha de implementación:** 2026-03-09  
**Versión:** 1.0
