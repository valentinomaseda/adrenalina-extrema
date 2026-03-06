/**
 * EJEMPLO DE ESTRUCTURA DE DATOS PARA RUTINAS
 * 
 * Este archivo documenta la estructura de objetos ExerciseInstance
 * utilizada en el sistema de rutinas del Dashboard.
 */

// =============================================
// ESTRUCTURA DE EXERCISEINSTANCE
// =============================================

const exerciseInstanceExample = {
  exerciseId: 1,             // ID del ejercicio predefinido
  name: "Burpees",           // Nombre del ejercicio
  type: "reps",              // Tipo: "reps" | "segundos"
  value: 15,                 // Cantidad (número de reps o segundos)
  sets: 3                    // Número de series
}

// =============================================
// EJEMPLO DE RUTINA COMPLETA
// =============================================

const routineExample = {
  name: "HIIT Avanzado",
  exercises: [
    {
      exerciseId: 1,
      name: "Burpees",
      type: "reps",
      value: 15,
      sets: 3
    },
    {
      exerciseId: 6,
      name: "Plancha",
      type: "segundos",
      value: 45,
      sets: 3
    },
    {
      exerciseId: 4,
      name: "Sprint 100m",
      type: "segundos",
      value: 20,
      sets: 5
    }
  ],
  createdAt: "2026-03-06T10:30:00.000Z"
}

// =============================================
// EJERCICIOS PREDEFINIDOS DISPONIBLES
// =============================================

const availableExercises = [
  { id: 1, name: 'Burpees', defaultType: 'reps' },
  { id: 2, name: 'Estocadas', defaultType: 'reps' },
  { id: 3, name: 'Trote Suave', defaultType: 'segundos' },
  { id: 4, name: 'Sprint 100m', defaultType: 'segundos' },
  { id: 5, name: 'Mountain Climbers', defaultType: 'reps' },
  { id: 6, name: 'Plancha', defaultType: 'segundos' },
  { id: 7, name: 'Jumping Jacks', defaultType: 'reps' },
  { id: 8, name: 'Sentadillas', defaultType: 'reps' },
  { id: 9, name: 'Desplazamientos Laterales', defaultType: 'reps' },
  { id: 10, name: 'Skipping Alto', defaultType: 'reps' },
]

// =============================================
// FLUJO DE CREACIÓN EN ROUTINEBUILDER
// =============================================

// 1. Usuario ingresa nombre de rutina
// 2. Usuario hace clic en "Agregar ejercicio"
// 3. Se crea un nuevo ExerciseInstance con valores por defecto
// 4. Usuario configura:
//    - Ejercicio (desde selector)
//    - Tipo (reps o segundos)
//    - Valor numérico
//    - Número de sets
// 5. Repetir pasos 2-4 para más ejercicios
// 6. Usuario hace clic en "Guardar Rutina"
// 7. Se valida y se genera el objeto routine completo

export { exerciseInstanceExample, routineExample, availableExercises }
