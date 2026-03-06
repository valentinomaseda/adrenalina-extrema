import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

// Mock Data
const MOCK_STUDENTS = [
  {
    id: 1,
    name: 'Juan Pérez',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    level: 'Avanzado',
    progress: [85, 72, 90, 88, 95],
    routineHistory: [
      { id: 1, name: 'Cardio Intenso', date: '2026-03-01', completed: true },
      { id: 2, name: 'Fuerza + Resis', date: '2026-02-28', completed: true },
    ]
  },
  {
    id: 2,
    name: 'María López',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    level: 'Intermedio',
    progress: [60, 65, 70, 68, 75],
    routineHistory: [
      { id: 3, name: 'Iniciación Sprint', date: '2026-03-02', completed: true },
    ]
  },
  {
    id: 3,
    name: 'Carlos Ruiz',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    level: 'Principiante',
    progress: [45, 50, 52, 55, 60],
    routineHistory: []
  },
  {
    id: 4,
    name: 'Ana García',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    level: 'Avanzado',
    progress: [80, 82, 85, 83, 90],
    routineHistory: [
      { id: 4, name: 'HIIT Avanzado', date: '2026-03-03', completed: false },
    ]
  },
  {
    id: 5,
    name: 'Luis Fernández',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luis',
    level: 'Intermedio',
    progress: [55, 58, 62, 65, 70],
    routineHistory: [
      { id: 5, name: 'Resistencia Base', date: '2026-03-04', completed: true },
      { id: 6, name: 'Velocidad Sprint', date: '2026-03-05', completed: false },
    ]
  },
]

const MOCK_EXERCISES = [
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

export const AppProvider = ({ children }) => {
  const [userRole] = useState('coach')
  const [students, setStudents] = useState(MOCK_STUDENTS)
  const [exercises] = useState(MOCK_EXERCISES)
  const [currentView, setCurrentView] = useState('students')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const value = {
    userRole,
    students,
    setStudents,
    exercises,
    currentView,
    setCurrentView,
    selectedStudent,
    setSelectedStudent,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
