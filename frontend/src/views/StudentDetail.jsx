import { useState } from 'react'
import { ArrowLeft, TrendingUp, Calendar, CheckCircle2, XCircle, Send, Plus, ChevronDown, ChevronUp, Info, X, Phone, Mail, Weight, Ruler, MapPin, Cake, Trash2, Edit } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppContext } from '../context/AppContext'
import AchievementBadges from '../components/AchievementBadges'
import StreakDisplay from '../components/StreakDisplay'

export default function StudentDetail() {
  const { selectedStudent, setCurrentView, setSelectedStudent, savedRoutines, assignRoutineToStudent, removeRoutineFromStudent, updateStudent, updateStudentRoutineStatus, showAlert } = useAppContext()
  const [selectedRoutineId, setSelectedRoutineId] = useState('')
  const [showAssignSuccess, setShowAssignSuccess] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [routineToDelete, setRoutineToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})
  const [showEditSuccess, setShowEditSuccess] = useState(false)
  const [showEditError, setShowEditError] = useState(false)
  const [editErrorMessage, setEditErrorMessage] = useState('')
  const [updatingRoutineStatus, setUpdatingRoutineStatus] = useState(null)

  // Función para formatear rutina como texto plano para WhatsApp
  const formatRoutineForWhatsApp = (routine) => {
    let text = `🏃 *${routine.name}*\n\n`
    
    routine.exercises.forEach((exercise, index) => {
      text += `${index + 1}. *${exercise.name}*\n`
      text += `   • ${exercise.value} ${exercise.type === 'reps' ? 'repeticiones' : 'segundos'}\n`
      text += `   • ${exercise.sets} ${exercise.sets === 1 ? 'serie' : 'series'}\n\n`
    })
    
    text += '💪 _¡Vamos con todo!_'
    return text
  }

  // Función para enviar por WhatsApp
  const handleSendWhatsApp = (routine) => {
    const formattedText = formatRoutineForWhatsApp(routine)
    const encodedText = encodeURIComponent(formattedText)
    const whatsappUrl = `https://wa.me/?text=${encodedText}`
    window.open(whatsappUrl, '_blank')
  }

  // Función para asignar rutina
  const handleAssignRoutine = () => {
    if (!selectedRoutineId) {
      showAlert('Por favor selecciona una rutina', 'warning')
      return
    }
    
    const routine = savedRoutines.find(r => r.id === parseInt(selectedRoutineId))
    if (routine) {
      assignRoutineToStudent(selectedStudent.id, routine)
      setShowAssignSuccess(true)
      setTimeout(() => {
        setShowAssignSuccess(false)
        setSelectedRoutineId('')
      }, 2000)
    }
  }

  // Función para eliminar rutina
  const handleDeleteRoutine = async () => {
    if (routineToDelete) {
      await removeRoutineFromStudent(selectedStudent.id, routineToDelete.id, routineToDelete.fechaAsignacion)
      setShowDeleteModal(false)
      setRoutineToDelete(null)
    }
  }

  // Función para editar alumno
  const handleEditStudent = async (e) => {
    e.preventDefault()
    setEditErrorMessage('')
    setShowEditError(false)
    
    try {
      await updateStudent(selectedStudent.id, editFormData)
      setShowEditModal(false)
      setShowEditSuccess(true)
      setTimeout(() => {
        setShowEditSuccess(false)
      }, 3000)
    } catch (error) {
      setEditErrorMessage(error.message || 'Error al actualizar el alumno')
      setShowEditError(true)
      setTimeout(() => {
        setShowEditError(false)
      }, 5000)
    }
  }

  // Función para actualizar estado de rutina
  const handleUpdateRoutineStatus = async (routineId, newStatus, fechaAsignacion) => {
    setUpdatingRoutineStatus(routineId)
    try {
      const updatedStudents = await updateStudentRoutineStatus(selectedStudent.id, routineId, newStatus, fechaAsignacion)
      
      // Actualizar el selectedStudent con los datos actualizados
      if (updatedStudents) {
        const updatedStudent = updatedStudents.find(s => s.id === selectedStudent.id)
        if (updatedStudent) {
          setSelectedStudent(updatedStudent)
        }
      }
    } catch (error) {
      console.error('Error updating routine status:', error)
      showAlert('Error al actualizar el estado de la rutina', 'error')
    } finally {
      setUpdatingRoutineStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada':
        return 'border-green-400'
      case 'incompleta':
        return 'border-yellow-400'
      case 'activa':
      default:
        return 'border-[#1E40AF]'
    }
  }

  if (!selectedStudent) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">No se ha seleccionado ningún alumno</p>
      </div>
    )
  }

  const handleBack = () => {
    setSelectedStudent(null)
    setCurrentView('students')
  }

  // Preparar datos para el gráfico usando routineHistory con status
  const routinesWithStatus = selectedStudent.routineHistory || []
  
  // Calcular estadísticas
  const totalRoutines = routinesWithStatus.length
  const completedRoutines = routinesWithStatus.filter(r => r.status === 'completada').length
  const incompleteRoutines = routinesWithStatus.filter(r => r.status === 'incompleta').length
  
  const completionRate = totalRoutines > 0 ? Math.round((completedRoutines / totalRoutines) * 100) : 0

  // Datos para el gráfico de progreso basados en status real
  const chartData = routinesWithStatus
    .filter(r => r.status === 'completada' || r.status === 'incompleta')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((routine, index) => ({
      sesion: `S${index + 1}`,
      rendimiento: routine.status === 'completada' ? 100 : 50,
      fecha: routine.date
    }))

  // Último rendimiento
  const lastPerformance = chartData.length > 0 ? chartData[chartData.length - 1].rendimiento : 0
  
  // Promedio de rendimiento
  const averagePerformance = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.rendimiento, 0) / chartData.length)
    : 0

  // Calcular racha de días consecutivos
  const calculateStreak = () => {
    if (!routinesWithStatus || routinesWithStatus.length === 0) return { current: 0, longest: 0 }
    
    const sortedDates = routinesWithStatus
      .filter(r => r.status === 'completada')
      .map(r => new Date(r.date).toDateString())
      .sort((a, b) => new Date(b) - new Date(a))
    
    const uniqueDates = [...new Set(sortedDates)]
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1
    
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Verificar si entrenó hoy o ayer para racha actual
    const lastDate = uniqueDates[0] ? new Date(uniqueDates[0]) : null
    if (lastDate) {
      const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24))
      if (daysDiff <= 1) {
        currentStreak = 1
        // Calcular el resto de la racha
        for (let i = 1; i < uniqueDates.length; i++) {
          const prevDate = new Date(uniqueDates[i - 1])
          const currDate = new Date(uniqueDates[i])
          const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24))
          if (diff === 1) {
            currentStreak++
          } else {
            break
          }
        }
      }
    }
    
    // Calcular la racha más larga
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])
      const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24))
      
      if (diff === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak, uniqueDates.length > 0 ? 1 : 0)
    
    return { current: currentStreak, longest: longestStreak }
  }

  const streak = calculateStreak()

  // Estadísticas para logros
  const achievementStats = {
    completedRoutines,
    currentStreak: streak.current,
    completionRate,
    averagePerformance
  }

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 animate-slide-in-left">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-[#1E40AF] active:scale-95 transition-all text-[#00BFFF]"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-2xl font-bold text-[#F3F4F6]">Detalle del Alumno</h2>
      </div>

      {/* Notificaciones de edición */}
      {showEditSuccess && (
        <div className="bg-green-600 border-2 border-green-400 text-white px-6 py-4 rounded-lg animate-scale-in mb-4">
          <p className="font-semibold">✓ Alumno actualizado exitosamente</p>
        </div>
      )}

      {showEditError && (
        <div className="bg-red-600 border-2 border-red-400 text-white px-6 py-4 rounded-lg animate-shake mb-4">
          <p className="font-semibold">✗ {editErrorMessage}</p>
        </div>
      )}

      {/* Card del alumno */}
      <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-lg p-6 animate-slide-in-up delay-100 border border-[#1E40AF]">
        <div className="flex items-center space-x-4">
          <img
            src={selectedStudent.photo}
            alt={selectedStudent.name}
            className="w-24 h-24 rounded-full border-4 border-[#00BFFF]"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-2xl font-bold text-[#00BFFF]">{selectedStudent.name}</h3>
              <button
                onClick={() => setShowInfoModal(true)}
                className="p-2 bg-[#00BFFF] text-white rounded-full hover:bg-[#1E40AF] active:scale-95 transition-all"
                title="Ver información completa"
              >
                <Info size={20} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => {
                  setEditFormData({
                    nombre: selectedStudent.name,
                    telefono: selectedStudent.phone || '',
                    email: selectedStudent.email || '',
                    peso: selectedStudent.weight || '',
                    altura: selectedStudent.height || '',
                    domicilio: selectedStudent.address || '',
                    fechaNacimiento: selectedStudent.birthDate || '',
                    nivel: selectedStudent.level || 'Intermedio',
                    genero: selectedStudent.gender || 'masculino'
                  })
                  setShowEditModal(true)
                }}
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 active:scale-95 transition-all"
                title="Editar alumno"
              >
                <Edit size={20} strokeWidth={2.5} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedStudent.level === 'Avanzado'
                    ? 'bg-[#00FF88] text-[#111827]'
                    : selectedStudent.level === 'Intermedio'
                    ? 'bg-[#00BFFF] text-[#111827]'
                    : 'bg-[#FFD700] text-[#111827]'
                }`}
              >
                {selectedStudent.level}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Modal de información del alumno */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto animate-fade-in">
          <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full my-8 animate-scale-in border border-[#00BFFF]">
            <div className="sticky top-0 bg-[#1E40AF] text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Información del Alumno</h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="p-2 hover:bg-[#00BFFF] rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4 pb-4 border-b border-[#1E40AF]">
                <img
                  src={selectedStudent.photo}
                  alt={selectedStudent.name}
                  className="w-20 h-20 rounded-full border-4 border-[#00BFFF]"
                />
                <div>
                  <h4 className="text-xl font-bold text-[#00BFFF]">{selectedStudent.name}</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                    selectedStudent.level === 'Avanzado'
                      ? 'bg-[#00FF88] text-[#111827]'
                      : selectedStudent.level === 'Intermedio'
                      ? 'bg-[#00BFFF] text-white'
                      : 'bg-[#FFD700] text-[#111827]'
                  }`}>
                    {selectedStudent.level}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-[#111827] rounded-lg border border-[#1E40AF]">
                  <Phone className="text-[#00BFFF] mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-[#00BFFF] font-semibold">Teléfono</p>
                    <p className="text-[#F3F4F6] font-semibold">{selectedStudent.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-[#111827] rounded-lg border border-[#1E40AF]">
                  <Mail className="text-[#00BFFF] mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-[#00BFFF] font-semibold">Email</p>
                    <p className="text-[#F3F4F6] font-semibold">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-[#111827] rounded-lg border border-[#1E40AF]">
                  <MapPin className="text-[#00BFFF] mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-[#00BFFF] font-semibold">Dirección</p>
                    <p className="text-[#F3F4F6] font-semibold">{selectedStudent.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-[#111827] rounded-lg border border-[#1E40AF]">
                  <Cake className="text-[#00BFFF] mt-1" size={20} strokeWidth={2.5} />
                  <div>
                    <p className="text-xs text-[#00BFFF] font-semibold">Fecha de Nacimiento</p>
                    <p className="text-[#F3F4F6] font-semibold">{new Date(selectedStudent.birthDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start space-x-3 p-3 bg-[#111827] rounded-lg border border-[#1E40AF]">
                    <Weight className="text-[#00BFFF] mt-1" size={20} strokeWidth={2.5} />
                    <div>
                      <p className="text-xs text-[#00BFFF] font-semibold">Peso</p>
                      <p className="text-[#F3F4F6] font-bold">{selectedStudent.weight} kg</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-[#111827] rounded-lg border border-[#1E40AF]">
                    <Ruler className="text-[#00BFFF] mt-1" size={20} strokeWidth={2.5} />
                    <div>
                      <p className="text-xs text-[#00BFFF] font-semibold">Altura</p>
                      <p className="text-[#F3F4F6] font-bold">{selectedStudent.height} cm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Asignar nueva rutina */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-200 border border-[#00BFFF]/20">
        <div className="flex items-center space-x-2 mb-4">
          <Plus className="text-[#00BFFF]" size={20} />
          <h4 className="text-lg font-semibold text-[#F3F4F6]">Asignar Nueva Rutina</h4>
        </div>

        {showAssignSuccess && (
          <div className="bg-[#1E40AF] border-2 border-[#00BFFF] text-[#00BFFF] px-6 py-4 rounded-lg mb-4 animate-pulse">
            <p className="font-semibold">✓ Rutina asignada exitosamente</p>
          </div>
        )}

        {savedRoutines.length === 0 ? (
          <p className="text-[#F3F4F6] text-center py-8">No hay rutinas guardadas. Crea una rutina en la sección "Rutinas".</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={selectedRoutineId}
              onChange={(e) => setSelectedRoutineId(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg bg-[#111827] text-[#F3F4F6]"
            >
              <option value="">Selecciona una rutina...</option>
              {savedRoutines.map((routine) => (
                <option key={routine.id} value={routine.id}>
                  {routine.name} ({routine.exercises.length} ejercicios)
                </option>
              ))}
            </select>
            <button
              onClick={handleAssignRoutine}
              className="px-6 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-bold"
            >
              Asignar
            </button>
          </div>
        )}
      </div>

      {/* Historial de rutinas */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-300 border border-[#00BFFF]/20">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="text-[#00BFFF]" size={20} />
          <h4 className="text-lg font-semibold text-[#F3F4F6]">Historial de Rutinas</h4>
        </div>

        {selectedStudent.routineHistory.length === 0 ? (
          <p className="text-[#F3F4F6] text-center py-8">No hay rutinas asignadas aún</p>
        ) : (
          <div className="space-y-3">
            {selectedStudent.routineHistory.map((routine, index) => (
              <div
                key={`${routine.id}-${routine.date}-${index}`}
                className={`bg-[#111827] rounded-lg border-2 ${getStatusColor(routine.status)} hover:border-[#00BFFF] transition-colors overflow-hidden`}
              >
                {/* Header de la rutina */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-[#F3F4F6]">{routine.name}</h5>
                      <p className="text-sm text-[#00BFFF] mt-1">{routine.date}</p>
                      {routine.exercises && (
                        <p className="text-xs text-[#F3F4F6] mt-1">{routine.exercises.length} ejercicios</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {routine.exercises && (
                        <button
                          onClick={() => handleSendWhatsApp(routine)}
                          className="p-2 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all"
                          title="Enviar por WhatsApp"
                        >
                          <Send size={20} strokeWidth={2.5} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setRoutineToDelete(routine)
                          setShowDeleteModal(true)
                        }}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition-all"
                        title="Eliminar rutina"
                      >
                        <Trash2 size={20} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Estado actual */}
                  <div className="flex items-center justify-between p-2 bg-[#0a0f1a] rounded-lg mb-3">
                    <span className="text-[#F3F4F6] font-semibold text-sm">Estado:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      routine.status === 'completada' ? 'bg-green-600 text-white' :
                      routine.status === 'incompleta' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {routine.status === 'completada' ? 'Completada' :
                       routine.status === 'incompleta' ? 'Incompleta' :
                       'Pendiente'}
                    </span>
                  </div>

                  {/* Botones de estado */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleUpdateRoutineStatus(routine.id, 'completada', routine.fechaAsignacion)}
                      disabled={updatingRoutineStatus === routine.id || routine.status === 'completada'}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 ${
                        routine.status === 'completada'
                          ? 'bg-green-600 text-white'
                          : 'bg-[#0a0f1a] text-[#F3F4F6] hover:bg-green-600 hover:text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      ✓ Completada
                    </button>
                    <button
                      onClick={() => handleUpdateRoutineStatus(routine.id, 'incompleta', routine.fechaAsignacion)}
                      disabled={updatingRoutineStatus === routine.id || routine.status === 'incompleta'}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 ${
                        routine.status === 'incompleta'
                          ? 'bg-yellow-600 text-white'
                          : 'bg-[#0a0f1a] text-[#F3F4F6] hover:bg-yellow-600 hover:text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      ◐ Incompleta
                    </button>
                    <button
                      onClick={() => handleUpdateRoutineStatus(routine.id, 'activa', routine.fechaAsignacion)}
                      disabled={updatingRoutineStatus === routine.id || routine.status === 'activa'}
                      className={`px-2 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 ${
                        routine.status === 'activa'
                          ? 'bg-gray-600 text-white'
                          : 'bg-[#0a0f1a] text-[#F3F4F6] hover:bg-gray-600 hover:text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      ○ Pendiente
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón para mostrar progreso */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up delay-400 border border-[#00BFFF]/20">
        <button
          onClick={() => setShowProgress(!showProgress)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#111827] text-[#F3F4F6] rounded-lg hover:bg-[#00BFFF] hover:text-[#111827] active:scale-95 transition-all font-semibold"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp size={20} strokeWidth={2.5} />
            <span>Progreso Reciente</span>
          </div>
          {showProgress ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>

        {showProgress && (
          <div className="mt-6 space-y-6">
            {/* Gráfico de progreso */}
            {chartData.length > 0 ? (
              <div>
                <h4 className="text-sm font-bold text-[#F3F4F6] mb-3">Rendimiento en el Tiempo</h4>
                <div className="bg-[#111827] rounded-lg p-4" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E40AF" />
                      <XAxis dataKey="sesion" stroke="#F3F4F6" />
                      <YAxis domain={[0, 100]} stroke="#F3F4F6" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#111827', border: '2px solid #00BFFF', borderRadius: '8px' }}
                        labelStyle={{ color: '#F3F4F6' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rendimiento"
                        stroke="#00BFFF"
                        strokeWidth={3}
                        dot={{ fill: '#00BFFF', r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  100% = Completada | 50% = Incompleta
                </p>
              </div>
            ) : (
              <div className="bg-[#111827] rounded-lg p-8 text-center">
                <TrendingUp className="mx-auto text-gray-500 mb-3" size={48} />
                <p className="text-[#F3F4F6] font-semibold mb-2">No hay datos de progreso aún</p>
                <p className="text-sm text-gray-400">
                  El gráfico aparecerá cuando el alumno complete o marque rutinas como incompletas.
                </p>
              </div>
            )}

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#00BFFF]">
                  {lastPerformance}%
                </p>
                <p className="text-xs text-[#F3F4F6] mt-1">Último rendimiento</p>
              </div>
              <div className="bg-[#111827] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#00BFFF]">
                  {averagePerformance}%
                </p>
                <p className="text-xs text-[#F3F4F6] mt-1">Promedio</p>
              </div>
              <div className="bg-[#111827] rounded-lg p-4 text-center col-span-2 md:col-span-1">
                <p className="text-3xl font-bold text-[#00BFFF]">
                  {completedRoutines}
                </p>
                <p className="text-xs text-[#F3F4F6] mt-1">Rutinas completadas</p>
              </div>
            </div>

            {/* Resumen adicional */}
            <div className="bg-[#111827] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-[#F3F4F6]">Tasa de Completado</h4>
                <span className="text-2xl font-bold text-[#00BFFF]">{completionRate}%</span>
              </div>
              <div className="w-full bg-[#0f1729] rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00BFFF] to-[#00FF88] h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {completedRoutines} de {totalRoutines} rutinas completadas
                {incompleteRoutines > 0 && ` · ${incompleteRoutines} incompletas`}
              </p>
            </div>

            {/* Racha de entrenamiento */}
            <div className="mt-6">
              <StreakDisplay currentStreak={streak.current} longestStreak={streak.longest} />
            </div>

            {/* Sistema de logros */}
            <div className="mt-6 bg-[#111827] rounded-lg p-4">
              <AchievementBadges stats={achievementStats} />
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full animate-scale-in border border-red-600">
            <div className="sticky top-0 bg-red-600 text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Confirmar Eliminación</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setRoutineToDelete(null)
                }}
                className="p-2 hover:bg-red-700 rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-[#F3F4F6]">
                ¿Estás seguro que deseas eliminar la rutina <strong className="text-[#00BFFF]">{routineToDelete?.name}</strong>?
              </p>
              <p className="text-sm text-gray-400">Esta acción no se puede deshacer.</p>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setRoutineToDelete(null)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteRoutine}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition-all font-semibold"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición de alumno */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-8 animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full my-8 animate-scale-in border border-[#00BFFF]">
            <div className="sticky top-0 bg-[#1E40AF] text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Editar Alumno</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-[#00BFFF] rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <form onSubmit={handleEditStudent} className="p-6 space-y-4">
              {showEditError && (
                <div className="bg-red-600 border-2 border-red-400 text-white px-4 py-3 rounded-lg animate-shake mb-4">
                  <p className="font-semibold text-sm">✗ {editErrorMessage}</p>
                </div>
              )}

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  value={editFormData.nombre || ''}
                  onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Nivel</label>
                <select
                  value={editFormData.nivel || 'Intermedio'}
                  onChange={(e) => setEditFormData({...editFormData, nivel: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                >
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Género</label>
                <select
                  value={editFormData.genero || 'masculino'}
                  onChange={(e) => setEditFormData({...editFormData, genero: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={editFormData.telefono || ''}
                  onChange={(e) => setEditFormData({...editFormData, telefono: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#00BFFF] font-semibold mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editFormData.peso || ''}
                    onChange={(e) => setEditFormData({...editFormData, peso: e.target.value})}
                    className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#00BFFF] font-semibold mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    value={editFormData.altura || ''}
                    onChange={(e) => setEditFormData({...editFormData, altura: e.target.value})}
                    className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Domicilio</label>
                <input
                  type="text"
                  value={editFormData.domicilio || ''}
                  onChange={(e) => setEditFormData({...editFormData, domicilio: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={editFormData.fechaNacimiento || ''}
                  onChange={(e) => setEditFormData({...editFormData, fechaNacimiento: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

