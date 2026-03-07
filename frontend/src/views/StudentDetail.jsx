import { useState } from 'react'
import { ArrowLeft, TrendingUp, Calendar, CheckCircle2, XCircle, Send, Plus, ChevronDown, ChevronUp, Info, X, Phone, Mail, Weight, Ruler, MapPin, Cake, Trash2, Edit } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppContext } from '../context/AppContext'

export default function StudentDetail() {
  const { selectedStudent, setCurrentView, setSelectedStudent, savedRoutines, assignRoutineToStudent, removeRoutineFromStudent, updateStudent } = useAppContext()
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
      alert('Por favor selecciona una rutina')
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
      await removeRoutineFromStudent(selectedStudent.id, routineToDelete.id)
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

  // Preparar datos para el gráfico
  const chartData = selectedStudent.progress.map((value, index) => ({
    sesion: `S${index + 1}`,
    rendimiento: value,
  }))

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
        <h2 className="text-2xl font-bold text-[#1E40AF]">Detalle del Alumno</h2>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in border border-[#00BFFF]">
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
            {selectedStudent.routineHistory.map((routine) => (
              <div
                key={routine.id}
                className="flex items-center justify-between p-4 bg-[#111827] rounded-lg border-2 border-[#1E40AF] hover:border-[#00BFFF] transition-colors"
              >
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
                  <div>
                    {routine.completed ? (
                      <CheckCircle2 className="text-green-600" size={28} strokeWidth={2.5} />
                    ) : (
                      <XCircle className="text-gray-400" size={28} strokeWidth={2.5} />
                    )}
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
            <div>
              <div className="bg-[#111827] rounded-lg p-4" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="sesion" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="rendimiento"
                      stroke="#00BFFF"
                      strokeWidth={3}
                      dot={{ fill: '#00BFFF', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#111827] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#00BFFF]">
                  {selectedStudent.progress[selectedStudent.progress.length - 1]}%
                </p>
                <p className="text-xs text-[#F3F4F6] mt-1">Último rendimiento</p>
              </div>
              <div className="bg-[#111827] rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-[#00BFFF]">
                  {Math.round(selectedStudent.progress.reduce((a, b) => a + b, 0) / selectedStudent.progress.length)}%
                </p>
                <p className="text-xs text-[#F3F4F6] mt-1">Promedio</p>
              </div>
              <div className="bg-[#111827] rounded-lg p-4 text-center col-span-2 md:col-span-1">
                <p className="text-3xl font-bold text-[#00BFFF]">
                  {selectedStudent.routineHistory.filter((r) => r.completed).length}
                </p>
                <p className="text-xs text-[#F3F4F6] mt-1">Rutinas completadas</p>
              </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
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

