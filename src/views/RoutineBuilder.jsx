import { useState } from 'react'
import { Plus, Trash2, Save, Dumbbell } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function RoutineBuilder() {
  const { exercises } = useAppContext()
  const [routineName, setRoutineName] = useState('')
  const [exerciseInstances, setExerciseInstances] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)

  const addExercise = () => {
    const newInstance = {
      id: Date.now(),
      exerciseId: exercises[0].id,
      name: exercises[0].name,
      type: exercises[0].defaultType,
      value: 10,
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
            }
          }
          return { ...ex, [field]: value }
        }
        return ex
      })
    )
  }

  const handleSave = () => {
    if (!routineName.trim()) {
      alert('Por favor ingresa un nombre para la rutina')
      return
    }
    if (exerciseInstances.length === 0) {
      alert('Agrega al menos un ejercicio')
      return
    }

    const routine = {
      name: routineName,
      exercises: exerciseInstances.map(({ id, ...rest }) => rest), // Remove temp IDs
      createdAt: new Date().toISOString(),
    }

    console.log('Rutina guardada:', routine)
    
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Reset form
    setRoutineName('')
    setExerciseInstances([])
  }

  return (
    <div className="p-4 space-y-6 pb-24 md:pb-6">
      <div className="flex items-center space-x-3">
        <Dumbbell className="text-primary" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-gray-900">Constructor de Rutinas</h2>
      </div>

      {showSuccess && (
        <div className="bg-green-100 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg animate-pulse">
          <p className="font-semibold">✓ Rutina guardada exitosamente</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Nombre de la rutina */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre de la Rutina
          </label>
          <input
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Ej: HIIT Avanzado"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
        </div>

        {/* Lista de ejercicios */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">Ejercicios</label>
            <button
              onClick={addExercise}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 active:scale-95 transition-all font-semibold"
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>Agregar</span>
            </button>
          </div>

          {exerciseInstances.length === 0 ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">No hay ejercicios. Haz clic en "Agregar" para empezar.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exerciseInstances.map((instance, index) => (
                <div
                  key={instance.id}
                  className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Ejercicio {index + 1}</span>
                    <button
                      onClick={() => removeExercise(instance.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition-all"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>

                  {/* Selector de ejercicio */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Ejercicio
                    </label>
                    <select
                      value={instance.exerciseId}
                      onChange={(e) => updateExercise(instance.id, 'exerciseId', e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {exercises.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Tipo */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Tipo</label>
                      <select
                        value={instance.type}
                        onChange={(e) => updateExercise(instance.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="reps">Reps</option>
                        <option value="segundos">Segundos</option>
                      </select>
                    </div>

                    {/* Valor */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        {instance.type === 'reps' ? 'Reps' : 'Seg'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={instance.value}
                        onChange={(e) =>
                          updateExercise(instance.id, 'value', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Sets */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Sets</label>
                      <input
                        type="number"
                        min="1"
                        value={instance.sets}
                        onChange={(e) =>
                          updateExercise(instance.id, 'sets', parseInt(e.target.value) || 1)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
          className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 transition-all font-bold text-lg shadow-md"
        >
          <Save size={24} strokeWidth={2.5} />
          <span>Guardar Rutina</span>
        </button>
      </div>
    </div>
  )
}
