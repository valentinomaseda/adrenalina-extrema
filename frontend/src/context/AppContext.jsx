import { createContext, useContext, useState, useEffect } from 'react'
import { personasAPI, ejerciciosAPI, rutinasAPI } from '../services/api'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}

// Helper para transformar datos del backend al formato del frontend
const transformPersonaToStudent = (persona) => {
  return {
    id: persona.idPersona,
    name: persona.nombre,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${persona.nombre}`,
    level: persona.nivel || 'Intermedio', // Puedes ajustar esto según tu lógica
    phone: persona.tel?.toString() || '',
    email: persona.mail,
    weight: persona.peso,
    height: persona.altura,
    address: persona.direccion || '',
    birthDate: persona.fechaNac ? new Date(persona.fechaNac).toISOString().split('T')[0] : '',
    progress: [],
    routineHistory: []
  }
}

const transformEjercicioToExercise = (ejercicio) => {
  return {
    id: ejercicio.idEjercicio,
    name: ejercicio.nombre,
    defaultType: ejercicio.contador?.includes('reps') ? 'reps' : 'segundos',
    cantSets: ejercicio.cantSets,
    contador: ejercicio.contador
  }
}

export const AppProvider = ({ children }) => {
  // Estado de autenticación
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Estados de datos
  const [students, setStudents] = useState([])
  const [exercises, setExercises] = useState([])
  const [currentView, setCurrentView] = useState('students')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [savedRoutines, setSavedRoutines] = useState([])
  const [loading, setLoading] = useState(false)

  // Cargar datos del usuario desde localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
        loadData()
      } catch (error) {
        console.error('Error loading user from localStorage:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Cargar datos del backend
  const loadData = async () => {
    setLoading(true)
    try {
      // Cargar alumnos
      const alumnos = await personasAPI.getByRol('alumno')
      setStudents(alumnos.map(transformPersonaToStudent))

      // Cargar ejercicios
      const ejercicios = await ejerciciosAPI.getAll()
      setExercises(ejercicios.map(transformEjercicioToExercise))

      // Cargar rutinas
      const rutinas = await rutinasAPI.getAll()
      setSavedRoutines(rutinas)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función de login
  const login = async (email, password) => {
    try {
      const persona = await personasAPI.login(email, password)
      
      // Guardar usuario en estado y localStorage
      setUser(persona)
      setIsAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(persona))
      
      // Cargar datos
      await loadData()
    } catch (error) {
      throw error
    }
  }

  // Función de logout
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('user')
    setStudents([])
    setExercises([])
    setSavedRoutines([])
    setCurrentView('students')
    setSelectedStudent(null)
  }

  // Función para refrescar alumnos
  const refreshStudents = async () => {
    try {
      const alumnos = await personasAPI.getByRol('alumno')
      setStudents(alumnos.map(transformPersonaToStudent))
    } catch (error) {
      console.error('Error refreshing students:', error)
      throw error
    }
  }

  // Función para refrescar ejercicios
  const refreshExercises = async () => {
    try {
      const ejercicios = await ejerciciosAPI.getAll()
      setExercises(ejercicios.map(transformEjercicioToExercise))
    } catch (error) {
      console.error('Error refreshing exercises:', error)
      throw error
    }
  }

  // Función para añadir nuevo alumno
  const addStudent = async (studentData) => {
    try {
      // Generar un ID único (en producción, el backend lo generaría)
      const newId = Math.max(0, ...students.map(s => s.id)) + 1
      
      const personaData = {
        idPersona: newId,
        nombre: studentData.name,
        mail: studentData.email,
        tel: parseInt(studentData.phone) || 0,
        rol: 'alumno',
        direccion: studentData.address || '',
        fechaNac: studentData.birthDate || null,
        peso: parseFloat(studentData.weight) || null,
        altura: parseFloat(studentData.height) || null,
        password: studentData.password || '123456' // Password por defecto
      }

      await personasAPI.create(personaData)
      await refreshStudents()
    } catch (error) {
      console.error('Error adding student:', error)
      throw error
    }
  }

  // Función para añadir nuevo ejercicio
  const addExercise = async (exerciseData) => {
    try {
      // Generar un ID único
      const newId = Math.max(0, ...exercises.map(e => e.id)) + 1
      
      const ejercicioData = {
        idEjercicio: newId,
        nombre: exerciseData.name,
        cantSets: parseInt(exerciseData.cantSets) || 3,
        contador: exerciseData.contador || '10 reps'
      }

      await ejerciciosAPI.create(ejercicioData)
      await refreshExercises()
    } catch (error) {
      console.error('Error adding exercise:', error)
      throw error
    }
  }

  // Función para guardar rutina
  const saveRoutine = async (routine) => {
    try {
      const newId = Math.max(0, ...savedRoutines.map(r => r.idRutina || r.id)) + 1
      
      const rutinaData = {
        idRutina: newId,
        nombre: routine.name,
        descripcion: routine.description || '',
        nivel: routine.level || 'Intermedio'
      }

      const createdRutina = await rutinasAPI.create(rutinaData)
      
      // Agregar ejercicios a la rutina si los hay
      if (routine.exercises && routine.exercises.length > 0) {
        for (let i = 0; i < routine.exercises.length; i++) {
          const exercise = routine.exercises[i]
          await rutinasAPI.addEjercicio({
            idRutina: newId,
            idEjercicio: exercise.id,
            orden: i + 1
          })
        }
      }

      setSavedRoutines([...savedRoutines, createdRutina])
      return createdRutina
    } catch (error) {
      console.error('Error saving routine:', error)
      throw error
    }
  }

  // Función para asignar rutina a alumno
  const assignRoutineToStudent = async (studentId, routine) => {
    try {
      await rutinasAPI.assignToPersona(routine.id, studentId)
      
      // Actualizar el estado local
      setStudents(students.map(student => {
        if (student.id === studentId) {
          return {
            ...student,
            routineHistory: [
              {
                id: Date.now(),
                name: routine.name,
                date: new Date().toISOString().split('T')[0],
                completed: false,
                exercises: routine.exercises
              },
              ...student.routineHistory
            ]
          }
        }
        return student
      }))
    } catch (error) {
      console.error('Error assigning routine:', error)
      throw error
    }
  }

  const value = {
    // Autenticación
    user,
    isAuthenticated,
    login,
    logout,
    
    // Datos
    students,
    setStudents,
    exercises,
    currentView,
    setCurrentView,
    selectedStudent,
    setSelectedStudent,
    savedRoutines,
    loading,
    
    // Funciones
    saveRoutine,
    assignRoutineToStudent,
    addStudent,
    addExercise,
    refreshStudents,
    refreshExercises,
    
    // Role (para compatibilidad)
    userRole: user?.rol || 'coach',
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
