import { useState } from 'react'
import { Plus, Trash2, Save, Dumbbell, List, Loader2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import Modal from '../components/Modal'

// Helper para formatear el nombre del tipo de ejercicio
const getTypeLabel = (type) => {
  const labels = {
    'reps': 'REPS',
    'segundos': 'SEGUNDOS',
    'minutos': 'MINUTOS',
    'horas': 'HORAS',
    'km': 'KM',
    'metros': 'METROS'
  }
  return labels[type] || type.toUpperCase()
}

// Helper para obtener la etiqueta del campo de valor
const getValueLabel = (type) => {
  const labels = {
    'reps': 'Repeticiones',
    'segundos': 'Segundos',
    'minutos': 'Minutos',
    'horas': 'Horas',
    'km': 'Kilómetros',
    'metros': 'Metros'
  }
  return labels[type] || 'Cantidad'
}

// Helper para obtener la unidad abreviada
const getUnitShort = (type) => {
  const units = {
    'reps': 'reps',
    'segundos': 'seg',
    'minutos': 'min',
    'horas': 'h',
    'km': 'km',
    'metros': 'm'
  }
  return units[type] || type
}

// Helper para extraer solo el número de un string como "5 km" -> 5
const parseNumericValue = (value) => {
  if (!value) return null
  // Si es un número, retornarlo
  if (typeof value === 'number') return value
  // Si es string, extraer solo los dígitos
  const match = String(value).match(/\d+/)
  return match ? parseInt(match[0]) : null
}

export default function RoutineBuilder() {
  const { exercises, saveRoutine, deleteRoutine, savedRoutines, showAlert } = useAppContext()
  const navigate = useNavigate()
  const [routineName, setRoutineName] = useState('')
  const [exerciseInstances, setExerciseInstances] = useState([])
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, routineId: null, routineName: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const addExercise = () => {
    const firstExercise = exercises[0]
    
    // Intentar usar distancia/duracion predeterminada, sino usar valor por defecto
    let defaultValue = 10 // Valor por defecto para reps
    if (firstExercise.defaultType !== 'reps') {
      const distanciaValue = parseNumericValue(firstExercise.distancia)
      const duracionValue = parseNumericValue(firstExercise.duracion)
      defaultValue = distanciaValue || duracionValue || 30
    }
    
    const newInstance = {
      id: Date.now(),
      exerciseId: firstExercise.id,
      name: firstExercise.name,
      type: firstExercise.defaultType,
      value: defaultValue,
      sets: firstExercise.defaultType === 'reps' ? 3 : 1, // Solo ejercicios de reps tienen múltiples series
      distancia: firstExercise.distancia || null,
      duracion: firstExercise.duracion || null,
      descripcionIntervalo: firstExercise.descripcionIntervalo || null
    }
    setExerciseInstances([...exerciseInstances, newInstance])
  }

  const removeExercise = (id) => {
    setExerciseInstances(exerciseInstances.filter((ex) => ex.id !== id))
  }

  const updateExercise = (id, field, value) => {
    // Validar valores numéricos
    if ((field === 'value' || field === 'sets') && value !== '') {
      const numValue = field === 'value' ? parseFloat(value) : parseInt(value)
      if (!isNaN(numValue) && numValue < (field === 'value' ? 0 : 1)) {
        showAlert(`El valor debe ser mayor o igual a ${field === 'value' ? 0 : 1}`, 'warning')
        return
      }
    }

    setExerciseInstances(
      exerciseInstances.map((ex) => {
        if (ex.id === id) {
          if (field === 'exerciseId') {
            const selectedExercise = exercises.find((e) => e.id === parseInt(value))
            
            // Calcular valor por defecto según tipo de ejercicio
            let defaultValue = 10
            if (selectedExercise.defaultType !== 'reps') {
              const distanciaValue = parseNumericValue(selectedExercise.distancia)
              const duracionValue = parseNumericValue(selectedExercise.duracion)
              defaultValue = distanciaValue || duracionValue || 30
            }
            
            return {
              ...ex,
              exerciseId: selectedExercise.id,
              name: selectedExercise.name,
              type: selectedExercise.defaultType,
              value: defaultValue,
              sets: selectedExercise.defaultType === 'reps' ? 3 : 1, // Ajustar sets según el tipo
              distancia: selectedExercise.distancia || null,
              duracion: selectedExercise.duracion || null,
              descripcionIntervalo: selectedExercise.descripcionIntervalo || null
            }
          }
          return { ...ex, [field]: value }
        }
        return ex
      })
    )
  }

  const handleSave = async () => {
    if (!routineName.trim()) {
      showAlert('Por favor ingresa un nombre para la rutina', 'warning')
      return
    }
    if (exerciseInstances.length === 0) {
      showAlert('Agrega al menos un ejercicio', 'warning')
      return
    }

    // Validar que todos los valores sean válidos
    for (const exercise of exerciseInstances) {
      if (!exercise.value || exercise.value <= 0) {
        showAlert('Todos los ejercicios deben tener valores mayores a 0', 'warning')
        return
      }
      // Solo validar sets para ejercicios de tipo 'reps'
      if (exercise.type === 'reps' && (!exercise.sets || exercise.sets < 1)) {
        showAlert('Los ejercicios de repeticiones deben tener al menos 1 serie', 'warning')
        return
      }
    }

    setSaving(true)
    try {
      const routine = {
        name: routineName,
        exercises: exerciseInstances.map(({ id, ...rest }) => rest), // Remove temp IDs
        createdAt: new Date().toISOString(),
      }

      // Guardar en contexto global
      await saveRoutine(routine)
      console.log('Rutina guardada:', routine)
      
      showAlert('Rutina guardada exitosamente', 'success')
      
      // Reset form
      setRoutineName('')
      setExerciseInstances([])
    } catch (error) {
      console.error('Error al guardar rutina:', error)
      showAlert('Error al guardar la rutina: ' + (error.message || 'Error desconocido'), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRoutine = (routineId, routineName) => {
    setDeleteModal({ isOpen: true, routineId, routineName })
  }

  const confirmDeleteRoutine = async () => {
    setDeleting(true)
    try {
      await deleteRoutine(deleteModal.routineId)
      setDeleteModal({ isOpen: false, routineId: null, routineName: '' })
      showAlert('Rutina eliminada exitosamente', 'success')
    } catch (error) {
      console.error('Error al eliminar rutina:', error)
      showAlert('Error al eliminar la rutina: ' + (error.message || 'Error desconocido'), 'error')
    } finally {
      setDeleting(false)
      setDeleteModal({ isOpen: false, routineId: null, routineName: '' })
    }
  }

  const cancelDeleteRoutine = () => {
    setDeleteModal({ isOpen: false, routineId: null, routineName: '' })
  }

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <Dumbbell className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#F3F4F6]">Constructor de Rutinas</h2>
      </div>

      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 space-y-6 animate-slide-in-up delay-100 border border-[#00BFFF]/20">
        {/* Nombre de la rutina */}
        <div>
          <label className="block text-sm font-semibold text-[#F3F4F6] mb-2">
            Nombre de la Rutina
          </label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Ej: HIIT Avanzado"
            className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg bg-[#111827] text-[#F3F4F6] placeholder-gray-400"
          />
        </div>

        {/* Lista de ejercicios */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-[#F3F4F6]">Ejercicios</label>
            <button
              onClick={addExercise}
              className="flex items-center space-x-2 px-4 py-2 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Agregar</span>
            </button>
          </div>

          {exerciseInstances.length === 0 ? (
            <div className="border-2 border-dashed border-[#111827] rounded-lg p-8 text-center">
              <p className="text-[#F3F4F6]">No hay ejercicios. Haz clic en "Agregar" para empezar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exerciseInstances.map((instance, index) => (
                <div
                  key={instance.id}
                  className="bg-[#111827] border-2 border-[#1E40AF] rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#F3F4F6]">Ejercicio {index + 1}</span>
                    <button
                      onClick={() => removeExercise(instance.id)}
                      className="p-2 text-[#00BFFF] hover:bg-[#1E40AF] rounded-lg active:scale-95 transition-all"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Selector de ejercicio */}
                  <div>
                    <label className="block text-xs font-semibold text-[#F3F4F6] mb-1">
                      Ejercicio
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={instance.exerciseId}
                        onChange={(e) => updateExercise(instance.id, 'exerciseId', e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#0f1729] text-[#F3F4F6]"
                      >
                        {exercises.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                      <span className="px-3 py-2 bg-[#00BFFF] text-[#111827] rounded-lg text-xs font-bold whitespace-nowrap">
                        {getTypeLabel(instance.type)}
                      </span>
                    </div>
                  </div>

                  <div className={`grid ${instance.type === 'reps' ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                    {/* Valor */}
                    <div>
                      <label className="block text-xs font-semibold text-[#F3F4F6] mb-1">
                        {getValueLabel(instance.type)}
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={instance.value}
                        onChange={(e) =>
                          updateExercise(instance.id, 'value', e.target.value === '' ? '' : parseFloat(e.target.value))
                        }
                        className="w-full px-3 py-2 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#1E40AF] text-[#F3F4F6]"
                      />
                    </div>

                    {/* Sets - Solo para ejercicios de repeticiones */}
                    {instance.type === 'reps' && (
                      <div>
                        <label className="block text-xs font-semibold text-[#F3F4F6] mb-1">Series</label>
                        <input
                          type="number"
                          min="1"
                          value={instance.sets}
                          onChange={(e) =>
                            updateExercise(instance.id, 'sets', e.target.value === '' ? '' : parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#1E40AF] text-[#F3F4F6]"
                        />
                      </div>
                    )}
                  </div>

                  {/* Información adicional del ejercicio */}
                  {(instance.distancia || instance.duracion || instance.descripcionIntervalo) && (
                    <div className="mt-3 pt-3 border-t border-[#1E40AF] space-y-2">
                      <p className="text-xs font-semibold text-[#00BFFF]">Información del Ejercicio:</p>
                      {instance.distancia && (
                        <p className="text-xs text-[#F3F4F6]">
                          <span className="font-semibold">Distancia predeterminada:</span> {instance.distancia} {instance.type === 'km' ? 'km' : 'metros'}
                        </p>
                      )}
                      {instance.duracion && (
                        <p className="text-xs text-[#F3F4F6]">
                          <span className="font-semibold">Duración:</span> {instance.duracion} {
                            instance.type === 'segundos' ? 'segundos' : 
                            instance.type === 'minutos' ? 'minutos' : 
                            'horas'
                          }
                        </p>
                      )}
                      {instance.descripcionIntervalo && (
                        <p className="text-xs text-[#F3F4F6]">
                          <span className="font-semibold">Intervalos:</span> {instance.descripcionIntervalo}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-bold text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#00BFFF] disabled:hover:text-[#111827]"
        >
          {saving ? (
            <Loader2 className="animate-spin" size={24} strokeWidth={2.5} />
          ) : (
            <Save size={24} strokeWidth={2.5} />
          )}
          <span>{saving ? 'Guardando...' : 'Guardar Rutina'}</span>
        </button>
      </div>

      {/* Lista de rutinas guardadas */}
      {savedRoutines.length > 0 && (
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 space-y-4 animate-slide-in-up delay-200 border border-[#00BFFF]/20">
          <div className="flex items-center space-x-3">
            <List className="text-[#00BFFF]" size={24} strokeWidth={2.5} />
            <h3 className="text-xl font-bold text-[#F3F4F6]">Rutinas Guardadas</h3>
            <span className="bg-[#00BFFF] text-[#111827] px-3 py-1 rounded-full text-sm font-bold">
              {savedRoutines.length}
            </span>
          </div>

          <div className="space-y-3">
            {savedRoutines.map((routine) => (
              <div
                key={routine.id}
                className="bg-[#111827] border-2 border-[#1E40AF] rounded-lg p-4 hover:border-[#00BFFF] transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-[#00BFFF] mb-2">{routine.name}</h4>
                    <div className="space-y-2">
                      {routine.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-[#F3F4F6] flex items-center space-x-2"
                        >
                          <span className="font-semibold text-[#00BFFF]">{idx + 1}.</span>
                          <span>{exercise.name}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-300">
                            {exercise.type === 'reps' 
                              ? `${exercise.sets} sets × ${exercise.value} ${getUnitShort(exercise.type)}`
                              : `${exercise.value} ${getUnitShort(exercise.type)}`
                            }
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">
                      Creada: {new Date(routine.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRoutine(routine.id, routine.name)}
                    className="ml-4 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:scale-95 transition-all"
                    title="Eliminar rutina"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón flotante para añadir ejercicio */}
      <button
        onClick={() => navigate('/agregar-ejercicio')}
        className="fixed bottom-20 md:bottom-8 right-8 bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2"
        title="Agregar Ejercicio"
      >
        <Plus size={20} />
        <span className="text-sm font-semibold">
          Agregar Ejercicio
        </span>
      </button>

      {/* Modal de confirmación para eliminar rutina */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={cancelDeleteRoutine}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la rutina "${deleteModal.routineName}"?\n\nEsta acción no se puede deshacer y se eliminarán todos los ejercicios asociados.`}
        type="warning"
        buttons={[
          {
            label: 'Cancelar',
            onClick: cancelDeleteRoutine,
            variant: 'secondary',
            disabled: deleting
          },
          {
            label: deleting ? 'Eliminando...' : 'Eliminar',
            onClick: confirmDeleteRoutine,
            variant: 'danger',
            loading: deleting
          }
        ]}
      />
    </div>
  )
}
