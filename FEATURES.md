# 🎯 Características Detalladas del MVP

## 📱 Mobile-First Design

### Adaptación según dispositivo
- **Móvil (< 768px)**: BottomNavbar fija con 3 botones grandes
- **Desktop (≥ 768px)**: Sidebar lateral con navegación expandida

### UX optimizada para pista
- Botones grandes (py-3, py-4)
- Alto contraste visual
- Feedback táctil: `active:scale-95`
- Animaciones suaves en todas las transiciones

## 🎨 Sistema de Diseño

### Colores
```css
--color-primary: #FF5722    /* Naranja vibrante */
--color-secondary: #2196F3   /* Azul energético */
```

### Estados de botones
- **Hover**: Scale 105%, cambio de color
- **Active**: Scale 95% (feedback táctil)
- **Focus**: Ring de 2px con color primario

### Niveles de alumno
- **Avanzado**: Badge verde (bg-green-100, text-green-800)
- **Intermedio**: Badge azul (bg-blue-100, text-blue-800)
- **Principiante**: Badge amarillo (bg-yellow-100, text-yellow-800)

## 🔍 Vista: StudentList

### Funcionalidades
1. **Buscador en tiempo real**
   - Filtrado por nombre (case-insensitive)
   - Icono Search de Lucide
   - Input con ring de focus

2. **Filtro por nivel**
   - Dropdown con 4 opciones: Todos, Principiante, Intermedio, Avanzado
   - Icono Filter de Lucide
   - Filtrado combinado con búsqueda

3. **Cards de alumno**
   - Foto avatar (DiceBear API)
   - Nombre prominente
   - Badge de nivel con color
   - Contador de rutinas asignadas
   - Hover: elevación de sombra + scale 105%
   - Border primario en hover

4. **Skeleton Loader**
   - Transición de 300ms al hacer clic
   - 3 cards animadas con pulse

### Responsive
- Mobile: Grid 1 columna
- Tablet: Grid 2 columnas
- Desktop: Grid 3 columnas

## 📊 Vista: StudentDetail

### Secciones

#### 1. Header con navegación
- Botón "Atrás" con icono ArrowLeft
- Título "Detalle del Alumno"

#### 2. Card de perfil
- Foto grande (w-24 h-24)
- Nombre del alumno
- Badge de nivel

#### 3. Gráfico de progreso (Recharts)
- LineChart con últimas 5 sesiones
- Eje X: Sesiones (S1, S2, S3...)
- Eje Y: Rendimiento (0-100%)
- Línea naranja (#FF5722) con grosor 3
- Dots de 6px en cada punto
- CartesianGrid con guías
- Tooltip interactivo

#### 4. Estadísticas rápidas (3 cards)
- **Último rendimiento**: % de última sesión (bg-orange-50)
- **Promedio**: % promedio de todas las sesiones (bg-blue-50)
- **Rutinas completadas**: Contador (bg-green-50)

#### 5. Historial de rutinas
- Lista de rutinas asignadas
- Cada item muestra:
  - Nombre de rutina
  - Fecha de asignación
  - Estado: CheckCircle (verde) o XCircle (gris)
- Hover: border primario

## 🏋️ Vista: RoutineBuilder

### Flujo de construcción

#### 1. Nombre de rutina
- Input text grande
- Placeholder: "Ej: HIIT Avanzado"
- Validación requerida

#### 2. Lista de ejercicios
- Inicialmente vacía con mensaje explicativo
- Border dashed cuando vacío

#### 3. Agregar ejercicio
- Botón naranja con icono Plus
- Crea ExerciseInstance con valores default:
  ```js
  {
    id: timestamp,
    exerciseId: 1,
    name: "Burpees",
    type: "reps",
    value: 10,
    sets: 3
  }
  ```

#### 4. Configuración de ejercicio
Cada card incluye:
- **Selector de ejercicio**: Dropdown con 10 ejercicios
- **Tipo**: Radio/Select (reps vs segundos)
- **Valor**: Input numérico (min: 1)
- **Sets**: Input numérico (min: 1)
- **Botón eliminar**: Icono Trash2 (rojo)

Layout: Grid de 3 columnas en desktop, stack en mobile

#### 5. Validaciones al guardar
- Nombre no vacío
- Al menos 1 ejercicio
- Valores numéricos válidos (handled by HTML5)

#### 6. Feedback de éxito
- Alert verde animado (animate-pulse)
- Duración: 3 segundos
- Auto-limpieza del formulario

## 👤 Vista: Profile

### Contenido (Placeholder)
- Avatar circular con icono UserCircle
- Nombre: "Coach Admin"
- Rol: "Entrenador Principal"
- Info cards:
  - Email con icono Mail
  - Teléfono con icono Phone
  - Alumnos activos con icono Award
- Botón "Editar Perfil"

## 🔄 Context API

### Estado global (AppContext)
```js
{
  userRole: 'coach',           // Rol simulado
  students: [...],             // Array de 5 alumnos
  exercises: [...],            // Array de 10 ejercicios
  currentView: 'students',     // Vista activa
  selectedStudent: null        // Alumno seleccionado
}
```

### Métodos
- `setStudents`: Actualizar lista de alumnos
- `setCurrentView`: Cambiar vista activa
- `setSelectedStudent`: Seleccionar alumno para detalle

## 🎭 Renderizado Condicional

### Switch de vistas en App.jsx
```
currentView === 'students'      → <StudentList />
currentView === 'studentDetail' → <StudentDetail />
currentView === 'routines'      → <RoutineBuilder />
currentView === 'profile'       → <Profile />
```

### Reset de estado
Al cambiar de vista desde la navegación:
- Se limpia `selectedStudent`
- Se actualiza `currentView`

## 🧩 Componentes Atómicos

### SkeletonLoader
- Props: `type` ('card' | 'list')
- Card: Simula card de alumno
- List: Simula lista de items
- Animación: `animate-pulse`

### BottomNavbar
- 3 botones: Alumnos, Rutinas, Perfil
- Iconos: Users, ClipboardList, UserCircle
- Estado activo: bg-orange-50, text-primary
- Hidden en desktop (md:hidden)

### Sidebar
- Header con logo y descripción
- 3 botones de navegación verticales
- Footer con info del coach
- Hidden en mobile (hidden md:flex)
- Fixed left, altura completa

## 🔥 Hot Module Replacement (HMR)

Vite provee HMR automático:
- Cambios en componentes se reflejan sin reload
- Estado se preserva cuando es posible
- Console logs mínimos

## 📦 Build Optimization

### Bundle actual
- CSS: 19.46 kB (gzip: 4.41 kB)
- JS: 560.64 kB (gzip: 170.72 kB)

### Recomendaciones futuras
- Code splitting con `React.lazy()`
- Lazy load de Recharts solo en StudentDetail
- Manual chunks para vendors grandes

## 🚀 Scripts npm

```bash
npm run dev      # Vite dev server (HMR)
npm run build    # Build de producción
npm run preview  # Preview del build
```

## 🌐 URLs de desarrollo

- **Local**: http://localhost:5173 (o 5174 si está ocupado)
- **Network**: Usar `vite --host` para exponer en red local
