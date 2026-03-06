# 📂 Estructura del Proyecto

```
adrenalina-extrema/
│
├── 📄 index.html                      # Entry point HTML
├── 📄 package.json                    # Dependencias y scripts
├── 📄 vite.config.js                  # Configuración de Vite
├── 📄 postcss.config.js               # Config PostCSS (Tailwind v4)
│
├── 📄 README.md                       # Documentación principal
├── 📄 FEATURES.md                     # Características detalladas
├── 📄 EXERCISE_STRUCTURE.js           # Ejemplo de estructura de datos
│
├── 📁 src/
│   ├── 📄 main.jsx                    # Entry point React
│   ├── 📄 App.jsx                     # Componente raíz con routing
│   ├── 📄 index.css                   # Estilos globales + Tailwind
│   │
│   ├── 📁 context/
│   │   └── 📄 AppContext.jsx          # Estado global + Mock Data
│   │
│   ├── 📁 components/
│   │   ├── 📄 Sidebar.jsx             # Navegación desktop
│   │   ├── 📄 BottomNavbar.jsx        # Navegación mobile
│   │   └── 📄 SkeletonLoader.jsx      # Loading states
│   │
│   └── 📁 views/
│       ├── 📄 StudentList.jsx         # Lista + búsqueda + filtros
│       ├── 📄 StudentDetail.jsx       # Detalle + gráfico + historial
│       ├── 📄 RoutineBuilder.jsx      # Constructor de rutinas
│       └── 📄 Profile.jsx             # Perfil del coach
│
└── 📁 dist/                           # Build de producción (generado)
    ├── index.html
    └── assets/
        ├── index-[hash].css
        └── index-[hash].js
```

## 🎯 Componentes Clave

### Layout
- **Sidebar** (Desktop): Navegación lateral fija con logo
- **BottomNavbar** (Mobile): Navegación inferior con 3 botones

### Views
- **StudentList**: Grid responsive de cards con búsqueda/filtros
- **StudentDetail**: Perfil + gráfico Recharts + historial de rutinas
- **RoutineBuilder**: Formulario dinámico para crear rutinas
- **Profile**: Vista de perfil del coach (placeholder)

### Context
- **AppContext**: Estado global con mock data de 5 alumnos y 10 ejercicios

### Utilities
- **SkeletonLoader**: Componente de loading animado

## 📊 Flujo de Datos

```
AppContext (estado global)
    ↓
App.jsx (routing condicional)
    ↓
    ├─→ StudentList → selecciona alumno → StudentDetail
    ├─→ RoutineBuilder → crea rutina → guarda en console
    └─→ Profile → muestra info coach

Navegación:
- Sidebar (desktop) / BottomNavbar (mobile)
  ↓
  setCurrentView('students' | 'routines' | 'profile')
```

## 🔑 Archivos de Configuración

| Archivo | Propósito |
|---------|-----------|
| `vite.config.js` | Configuración de Vite + plugin React |
| `postcss.config.js` | Plugin de Tailwind CSS v4 |
| `index.html` | Template HTML con script module |
| `src/index.css` | Import de Tailwind + theme custom |

## 🎨 Sistema de Temas

Colores definidos en `src/index.css`:
```css
@theme {
  --color-primary: #FF5722;    /* Naranja */
  --color-secondary: #2196F3;   /* Azul */
}
```

Uso en componentes:
```jsx
className="bg-primary text-white"
className="text-primary hover:bg-orange-600"
```

## 📦 Mock Data

Ubicación: `src/context/AppContext.jsx`

- **MOCK_STUDENTS**: 5 alumnos con nombre, foto, nivel, progreso, historial
- **MOCK_EXERCISES**: 10 ejercicios con id, name, defaultType

## 🚀 Estado del Proyecto

✅ Build de producción exitoso
✅ Sin errores de TypeScript/ESLint
✅ Servidor de desarrollo corriendo en http://localhost:5174/
✅ UX mobile-first implementada
✅ Sistema de rutinas funcionando
✅ Gráficos de progreso operativos
✅ Navegación responsive completa

## 📝 Próximos pasos (fuera del MVP)

- [ ] Backend API para persistencia
- [ ] Autenticación real de coaches
- [ ] Asignación de rutinas a alumnos
- [ ] Timer/cronómetro para ejecución
- [ ] Notificaciones push
- [ ] Exportar rutinas a PDF
- [ ] Analytics avanzado
