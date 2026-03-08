import { useState } from 'react'
import { Plus, Trash2, Save, Dumbbell, List } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function RoutineBuilder() {
  const { exercises, saveRoutine, savedRoutines, setCurrentView, showAlert } = useAppContext()
  const [routineName, setRoutineName] = useState('')
  const [exerciseInstances, setExerciseInstances] = useState([])

  const addExercise = () => {
    const firstExercise = exercises[0]
    const newInstance = {
      id: Date.now(),
      exerciseId: firstExercise.id,
      name: firstExercise.name,
      type: firstExercise.defaultType,
      value: firstExercise.defaultType === 'reps' ? 10 : 30,
      sets: 3,
    }
    setExerciseInstances([...exerciseInstances, newInstance])
  }

  const removeExercise = (id) => {
    setExerciseInstances(exerciseInstances.filter((ex) => ex.id !== id))
  }

  const updateExercise = (id, field, value) => {
    setExerciseInstances(
      exerciseInstances.map((ex) => {
        if (ex.id === id) {
          if (field === 'exerciseId') {
            const selectedExercise = exercises.find((e) => e.id === parseInt(value))
            return {
              ...ex,
              exerciseId: selectedExercise.id,
              name: selectedExercise.name,
              type: selectedExercise.defaultType,
              value: selectedExercise.defaultType === 'reps' ? 10 : 30,
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
    }
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
                        className="flex-1 px-3 py-2 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#1E40AF] text-[#F3F4F6]"
                      >
                        {exercises.map((ex) => (
                          <option key={ex.id} value={ex.id}>
                            {ex.name}
                          </option>
                        ))}
                      </select>
                      <span className="px-3 py-2 bg-[#00BFFF] text-[#111827] rounded-lg text-xs font-bold whitespace-nowrap">
                        {instance.type === 'reps' ? 'REPS' : 'SEGUNDOS'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Valor */}
                    <div>
                      <label className="block text-xs font-semibold text-[#F3F4F6] mb-1">
                        {instance.type === 'reps' ? 'Repeticiones' : 'Segundos'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={instance.value}
                        onChange={(e) =>
                          updateExercise(instance.id, 'value', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#1E40AF] text-[#F3F4F6]"
                      />
                    </div>

                    {/* Sets */}
                    <div>
                      <label className="block text-xs font-semibold text-[#F3F4F6] mb-1">Series</label>
                      <input
                        type="number"
                        min="1"
                        value={instance.sets}
                        onChange={(e) =>
                          updateExercise(instance.id, 'sets', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#1E40AF] text-[#F3F4F6]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-bold text-lg shadow-md"
        >
          <Save size={24} strokeWidth={2.5} />
          <span>Guardar Rutina</span>
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
                            {exercise.sets} sets × {exercise.value}{' '}
                            {exercise.type === 'reps' ? 'reps' : 'seg'}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón flotante para añadir ejercicio */}
      <button
        onClick={() => setCurrentView('addExercise')}
        className="fixed bottom-20 md:bottom-8 right-8 bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-2"
        title="Agregar Ejercicio"
      >
        <Plus size={20} />
        <span className="text-sm font-semibold">
          Agregar Ejercicio
        </span>
      </button>
    </div>
  )
}
