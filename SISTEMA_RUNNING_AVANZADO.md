# Sistema Avanzado para Rutinas de Running

## 🎯 Problema Resuelto

El sistema ahora soporta rutinas complejas de running con:
- ✅ Distancias (km, metros)
- ✅ Tiempos (minutos, horas, segundos)
- ✅ Intervalos complejos (3' suaves x 3' fuertes)
- ✅ Pausas variables entre series
- ✅ Intensidades específicas (rápidos, fondo, subida)
- ✅ Bloques de calentamiento

## 🗄️ Migración de Base de Datos

**Ejecutar:**
```bash
mysql -u root -p adrenalina_extrema < backend/migracion_ejercicios_running.sql
```

### Nuevos Campos:

**Tabla `ejercicio`:**
- `unidad`: ENUM('reps', 'segundos', 'minutos', 'horas', 'km', 'metros')
- `distancia`: VARCHAR(50) - Ej: "16 km", "200m"
- `duracion`: VARCHAR(50) - Ej: "1 hora", "18'"
- `descripcionIntervalo`: TEXT - Ej: "3' suaves x 3' fuertes"

**Tabla `rutina_ejercicio` y `alumno_rutina_ejercicio`:**
- `pausaSeries`: VARCHAR(50) - Ej: "1'", "3'", "trote de regreso"
- `intensidad`: TEXT - Ej: "Rápidos en km 4, 8 y 12"
- `esCalentamiento`: BOOLEAN - Si es calentamiento (TRUE/FALSE)

## 📝 Ejemplos de Uso

### Lunes: 16 km, rápidos 4, 8 y 12

```javascript
// Crear ejercicio
{
  idEjercicio: 10001,
  nombre: "Correr",
  unidad: "km"
}

// Agregar a rutina
{
  idRutina: 9001,
  idEjercicio: 10001,
  cantSets: 1,
  cantidad: 16,
  intensidad: "Rápidos en km 4, 8 y 12"
}
```

**Vista en Frontend:**
```
🏃 Correr
• 1 set x 16 km
📝 Intensidad: Rápidos en km 4, 8 y 12
```

---

### Martes: Intervalos Complejos

**Ejercicio 1: Calentamiento 2 km**
```javascript
{
  idEjercicio: 10001,
  cantSets: 1,
  cantidad: 2,
  esCalentamiento: true
}
```

**Ejercicio 2: Bloque 18' de 3x3**
```javascript
{
  idEjercicio: 10003, // Intervalos
  cantSets: 1,
  cantidad: 18,
  intensidad: "3 x 3: 3 minutos suaves x 3 minutos fuertes",
  pausaSeries: "3 minutos entre bloques"
}
```

**Ejercicio 3: Bloque 10' de 1x1**
```javascript
{
  idEjercicio: 10003,
  cantSets: 1,
  cantidad: 10,
  intensidad: "1 x 1: 1 minuto suave x 1 minuto fuerte",
  pausaSeries: "3 minutos entre bloques"
}
```

**Vista en Frontend:**
```
🔥 Calentamiento
🏃 Correr
• 1 set x 2 km

💪 Entrenamiento Principal
⏱️ Intervalos
• 1 set x 18 minutos
📝 Intensidad: 3 x 3: 3 minutos suaves x 3 minutos fuertes
⏸️ Pausa: 3 minutos entre bloques

⏱️ Intervalos
• 1 set x 10 minutos
📝 Intensidad: 1 x 1: 1 minuto suave x 1 minuto fuerte
⏸️ Pausa: 3 minutos entre bloques

⏱️ Intervalos
• 1 set x 18 minutos
📝 Intensidad: 3 x 3: 3 minutos suaves x 3 minutos fuertes
```

---

### Miércoles: 2 km + 16 x 200m en subida

**Ejercicio 1: Calentamiento**
```javascript
{
  idEjercicio: 10001, // Correr
  cantSets: 1,
  cantidad: 2,
  esCalentamiento: true
}
```

**Ejercicio 2: Series en subida**
```javascript
{
  idEjercicio: 10006, // Series en subida
  cantSets: 16,
  cantidad: 200,
  intensidad: "En subida",
  pausaSeries: "Regreso trote"
}
```

**Vista en Frontend:**
```
🔥 Calentamiento
🏃 Correr
• 1 set x 2 km

💪 Entrenamiento Principal
📈 Series en subida
• 16 sets x 200 metros
📝 Intensidad: En subida
⏸️ Pausa: Regreso trote
```

---

### Jueves: 2 km + 12 x 300m con 1' pausa

```javascript
// Calentamiento
{
  idEjercicio: 10001,
  cantSets: 1,
  cantidad: 2,
  esCalentamiento: true
}

// Repeticiones
{
  idEjercicio: 10004, // Repeticiones en distancia
  cantSets: 12,
  cantidad: 300,
  pausaSeries: "1 minuto"
}
```

---

### Viernes: 1 hora fondo

```javascript
{
  idEjercicio: 10005, // Fondo
  cantSets: 1,
  cantidad: 1,
  intensidad: "Ritmo constante"
}
```

**Vista en Frontend:**
```
🏃 Fondo
• 1 set x 1 hora
📝 Intensidad: Ritmo constante
```

---

## 🎨 Actualización del Frontend (Necesaria)

### 1. Componente: Crear/Editar Ejercicio

```jsx
// AddExercise.jsx - NUEVO DISEÑO

<div>
  <label>Nombre del Ejercicio</label>
  <input value={nombre} />
</div>

<div>
  <label>Unidad de Medida</label>
  <select value={unidad}>
    <option value="reps">Repeticiones</option>
    <option value="km">Kilómetros</option>
    <option value="metros">Metros</option>
    <option value="minutos">Minutos</option>
    <option value="horas">Horas</option>
    <option value="segundos">Segundos</option>
  </select>
</div>

{/* Mostrar campos según la unidad */}
{unidad === 'km' || unidad === 'metros' ? (
  <div>
    <label>Distancia Base (opcional)</label>
    <input value={distancia} placeholder="ej: 5 km, 200m" />
  </div>
) : null}

{unidad === 'minutos' || unidad === 'horas' ? (
  <div>
    <label>Duración Base (opcional)</label>
    <input value={duracion} placeholder="ej: 30', 1 hora" />
  </div>
) : null}

<div>
  <label>Descripción de Intervalo (opcional)</label>
  <textarea placeholder="ej: 3' suaves x 3' fuertes" />
</div>
```

### 2. Componente: Agregar Ejercicio a Rutina

```jsx
// Al agregar ejercicio a rutina, permitir configurar:

<div>
  <label>Sets/Repeticiones</label>
  <input type="number" value={cantSets} />
</div>

<div>
  <label>Cantidad ({ejercicio.unidad})</label>
  <input type="number" value={cantidad} />
</div>

<div>
  <label>Intensidad</label>
  <textarea 
    placeholder="Ej: Rápidos en km 4, 8 y 12"
    value={intensidad}
  />
</div>

<div>
  <label>Pausa entre series</label>
  <input 
    placeholder="Ej: 1', 3', trote"
    value={pausaSeries}
  />
</div>

<div>
  <label>
    <input type="checkbox" checked={esCalentamiento} />
    Es ejercicio de calentamiento
  </label>
</div>
```

### 3. Vista del Alumno - Rutinas

```jsx
// StudentRoutines.jsx - ACTUALIZADO

{routine.exercises.map((exercise, idx) => (
  <div className={exercise.esCalentamiento ? "bg-orange-900" : "bg-blue-900"}>
    {exercise.esCalentamiento && (
      <span className="badge">🔥 Calentamiento</span>
    )}
    
    <h5>{exercise.name}</h5>
    
    <div className="details">
      <span>
        {exercise.sets} {exercise.sets === 1 ? 'set' : 'sets'} x {exercise.value} {exercise.unidad}
      </span>
      
      {exercise.intensidad && (
        <p className="intensidad">
          📝 Intensidad: {exercise.intensidad}
        </p>
      )}
      
      {exercise.pausaSeries && (
        <p className="pausa">
          ⏸️ Pausa: {exercise.pausaSeries}
        </p>
      )}
      
      {exercise.especificaciones && (
        <p className="especificaciones">
          💬 {exercise.especificaciones}
        </p>
      )}
    </div>
  </div>
))}
```

---

## 🔄 Cambios en Backend

### Modelo `Ejercicio.js` - Actualizar

```javascript
static async create(ejercicioData) {
  const { 
    idEjercicio, 
    nombre, 
    tipoContador,
    unidad,          // NUEVO
    distancia,       // NUEVO
    duracion,        // NUEVO
    descripcionIntervalo  // NUEVO
  } = ejercicioData;
  
  const [result] = await pool.query(
    `INSERT INTO ejercicio 
     (idEjercicio, nombre, tipoContador, unidad, distancia, duracion, descripcionIntervalo) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      idEjercicio, 
      nombre, 
      tipoContador || 'reps',
      unidad || 'reps',
      distancia || null,
      duracion || null,
      descripcionIntervalo || null
    ]
  );
  return result;
}
```

### Modelo `Rutina.js` - Actualizar

```javascript
static async addEjercicio(idRutina, ejercicioData) {
  const { 
    idEjercicio, 
    cantSets, 
    cantidad, 
    orden,
    pausaSeries,        // NUEVO
    intensidad,         // NUEVO
    esCalentamiento     // NUEVO
  } = ejercicioData;
  
  const [result] = await pool.query(
    `INSERT INTO rutina_ejercicio 
     (idRutina, idEjercicio, cantSets, cantidad, orden, pausaSeries, intensidad, esCalentamiento) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      idRutina, 
      idEjercicio, 
      cantSets || 3, 
      cantidad || 10, 
      orden || null,
      pausaSeries || null,
      intensidad || null,
      esCalentamiento || false
    ]
  );
  return result;
}
```

---

## ✅ Checklist de Implementación

### Backend:
- [x] Script SQL de migración creado
- [ ] Actualizar `models/Ejercicio.js`
- [ ] Actualizar `models/Rutina.js`  
- [ ] Actualizar controladores para nuevos campos
- [ ] Actualizar API endpoints

### Frontend:
- [ ] Actualizar `AddExercise.jsx` - agregar selector de unidad
- [ ] Actualizar formulario de agregar ejercicio a rutina
- [ ] Actualizar `PersonalizeRoutine.jsx` - campos nuevos
- [ ] Actualizar `StudentRoutines.jsx` - mostrar intensidad/pausas
- [ ] Agregar indicador visual de calentamiento

### Testing:
- [ ] Crear rutina del Lunes (16km con rápidos)
- [ ] Crear rutina del Martes (intervalos complejos)
- [ ] Crear rutina del Miércoles (series en subida)
- [ ] Crear rutina del Jueves (repeticiones)
- [ ] Crear rutina del Viernes (fondo)

---

## 🚀 Próximos Pasos

1. **Ejecutar migración SQL**
2. **Actualizar modelos del backend** (te puedo ayudar)
3. **Actualizar frontend** (formularios y vistas)
4. **Probar creación de rutinas complejas**

¿Quieres que empiece a actualizar los modelos del backend ahora?
