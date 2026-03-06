# 🎨 Mockup Visual del Dashboard

## 📱 Vista Mobile (< 768px)

```
┌─────────────────────────────────────┐
│  🔍 [Buscar alumno...]      [▼ Nivel] │
├─────────────────────────────────────┤
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║  👤   Juan Pérez              ║  │
│  ║       🟢 Avanzado             ║  │
│  ║       2 rutinas               ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║  👤   María López             ║  │
│  ║       🔵 Intermedio          ║  │
│  ║       1 rutina                ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║  👤   Carlos Ruiz             ║  │
│  ║       🟡 Principiante        ║  │
│  ║       0 rutinas               ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ 👥 Alumnos | 📋 Rutinas | 👤 Perfil │
└─────────────────────────────────────┘
      ↑ Bottom Navbar (Fixed)
```

## 🖥️ Vista Desktop (≥ 768px)

```
┌──────────────┬──────────────────────────────────────────────────┐
│              │                                                  │
│  Adrenalina  │   StudentDetail - Juan Pérez                     │
│  Extrema     │   ← Atrás                                        │
│  Dashboard   │                                                  │
│              │   ╔════════════════════════════════════╗          │
│              │   ║  👤 Juan Pérez                     ║          │
│ ┌──────────┐ │   ║  🟢 Avanzado                      ║          │
│ │👥 Alumnos│ │   ╚════════════════════════════════════╝          │
│ └──────────┘ │                                                  │
│              │   📈 Progreso Reciente                            │
│ ┌──────────┐ │   ╔════════════════════════════════════╗          │
│ │📋 Rutinas│ │   ║    100 ┤                          ║          │
│ └──────────┘ │   ║     80 ┤     ●───●──●──●──●      ║          │
│              │   ║     60 ┤                          ║          │
│ ┌──────────┐ │   ║     40 ┤                          ║          │
│ │👤 Perfil │ │   ║      0 └──────────────────────── ║          │
│ └──────────┘ │   ║        S1  S2  S3  S4  S5         ║          │
│              │   ╚════════════════════════════════════╝          │
│              │                                                  │
│              │   ┌──────┬──────┬──────┐                         │
│              │   │ 95%  │ 86%  │  2   │                         │
│              │   │Último│Prom. │Compl.│                         │
│              │   └──────┴──────┴──────┘                         │
│              │                                                  │
│              │   📅 Historial de Rutinas                         │
│              │   ╔════════════════════════════════════╗          │
│ ┌──────────┐ │   ║ Cardio Intenso     ✓ 2026-03-01  ║          │
│ │👤 Coach  │ │   ╚════════════════════════════════════╝          │
│ │  Admin   │ │   ╔════════════════════════════════════╗          │
│ └──────────┘ │   ║ Fuerza + Resis     ✓ 2026-02-28  ║          │
│              │   ╚════════════════════════════════════╝          │
│              │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
   ↑ Sidebar (Fixed)
```

## 🏋️ RoutineBuilder Interface

```
┌─────────────────────────────────────────────────┐
│  💪 Constructor de Rutinas                      │
├─────────────────────────────────────────────────┤
│                                                 │
│  Nombre de la Rutina                            │
│  ┌───────────────────────────────────────────┐  │
│  │ HIIT Avanzado                             │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Ejercicios                      [➕ Agregar]   │
│  ┌───────────────────────────────────────────┐  │
│  │ Ejercicio 1                          🗑️  │  │
│  │ ┌─────────────────────────────────────┐  │  │
│  │ │ Ejercicio: [▼ Burpees             ] │  │  │
│  │ └─────────────────────────────────────┘  │  │
│  │ ┌────┬────┬────┐                         │  │
│  │ │Reps│ 15 │ 3  │                         │  │
│  │ │Tipo│Val │Sets│                         │  │
│  │ └────┴────┴────┘                         │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │ Ejercicio 2                          🗑️  │  │
│  │ ┌─────────────────────────────────────┐  │  │
│  │ │ Ejercicio: [▼ Plancha             ] │  │  │
│  │ └─────────────────────────────────────┘  │  │
│  │ ┌────┬────┬────┐                         │  │
│  │ │Seg │ 45 │ 3  │                         │  │
│  │ │Tipo│Val │Sets│                         │  │
│  │ └────┴────┴────┘                         │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │        💾 Guardar Rutina                  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🎨 Paleta de Colores

```
Primary (Naranja):  ████  #FF5722
Secondary (Azul):   ████  #2196F3

Niveles:
Avanzado:          🟢 ████  #10B981 (green-600)
Intermedio:        🔵 ████  #2196F3 (blue-500)
Principiante:      🟡 ████  #F59E0B (yellow-500)

Backgrounds:
White Cards:       ████  #FFFFFF
Gray BG:           ████  #F9FAFB (gray-50)
Hover BG:          ████  #F3F4F6 (gray-100)
```

## 🔄 Flujo de Interacción

```
INICIO
  │
  ├─→ Alumnos (StudentList)
  │    │
  │    ├─→ 🔍 Buscar → Filtrar en tiempo real
  │    │
  │    ├─→ 📊 Filtrar por nivel → Actualizar grid
  │    │
  │    └─→ Click en Card
  │         │
  │         └─→ StudentDetail
  │              │
  │              ├─→ Ver gráfico de progreso
  │              ├─→ Ver estadísticas
  │              ├─→ Ver historial
  │              └─→ ← Atrás → StudentList
  │
  ├─→ Rutinas (RoutineBuilder)
  │    │
  │    ├─→ Ingresar nombre
  │    │
  │    ├─→ ➕ Agregar ejercicio
  │    │    │
  │    │    ├─→ Seleccionar ejercicio
  │    │    ├─→ Configurar tipo/valor/sets
  │    │    └─→ 🗑️ Eliminar (opcional)
  │    │
  │    └─→ 💾 Guardar
  │         │
  │         └─→ ✓ Feedback → Reset formulario
  │
  └─→ Perfil
       │
       └─→ Ver info del coach
```

## 📐 Responsive Breakpoints

```
Mobile:    < 768px   (sm)
  └─→ BottomNavbar visible
  └─→ Sidebar hidden
  └─→ Grid: 1 columna

Tablet:    ≥ 768px   (md)
  └─→ BottomNavbar hidden
  └─→ Sidebar visible
  └─→ Grid: 2 columnas

Desktop:   ≥ 1024px  (lg)
  └─→ Sidebar visible
  └─→ Grid: 3 columnas
  └─→ Max-width: 7xl (1280px)
```

## 🎯 Estados Interactivos

```
BOTÓN EN REPOSO:
  ┌─────────────┐
  │   Click me  │  bg-primary text-white
  └─────────────┘

BOTÓN HOVER:
  ┌─────────────┐
  │   Click me  │  bg-orange-600 scale-105
  └─────────────┘
       ↑↑↑

BOTÓN ACTIVE:
  ┌───────────┐
  │ Click me  │    bg-orange-700 scale-95
  └───────────┘
     ↓↓↓

SKELETON LOADING:
  ┌─────────────┐
  │████████░░░░░│  animate-pulse
  │███░░░░░░░░░░│
  └─────────────┘
```

## 📊 Datos Mock

```
Students (5):
├─ Juan Pérez      🟢 Avanzado      [85, 72, 90, 88, 95]
├─ María López     🔵 Intermedio    [60, 65, 70, 68, 75]
├─ Carlos Ruiz     🟡 Principiante  [45, 50, 52, 55, 60]
├─ Ana García      🟢 Avanzado      [80, 82, 85, 83, 90]
└─ Luis Fernández  🔵 Intermedio    [55, 58, 62, 65, 70]

Exercises (10):
├─ Burpees                (reps)
├─ Estocadas              (reps)
├─ Trote Suave            (segundos)
├─ Sprint 100m            (segundos)
├─ Mountain Climbers      (reps)
├─ Plancha                (segundos)
├─ Jumping Jacks          (reps)
├─ Sentadillas            (reps)
├─ Desplazamientos Lat.   (reps)
└─ Skipping Alto          (reps)
```

## 🚀 Tech Stack Visual

```
┌──────────────────────────────────────┐
│         ADRENALINA EXTREMA           │
│         Coach Dashboard MVP          │
├──────────────────────────────────────┤
│                                      │
│  Frontend Framework:                 │
│    ⚛️  React 19                      │
│    ⚡ Vite 7                         │
│                                      │
│  Styling:                            │
│    🎨 Tailwind CSS v4                │
│    📦 PostCSS                        │
│                                      │
│  UI Components:                      │
│    🎭 Lucide React (icons)           │
│    📊 Recharts (charts)              │
│                                      │
│  State Management:                   │
│    🔄 Context API                    │
│    🎣 useState, useContext           │
│                                      │
└──────────────────────────────────────┘
```
