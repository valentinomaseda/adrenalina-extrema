import { useState, useEffect } from 'react'
import { X, Save, Dumbbell } from 'lucide-react'
import { rutinasAPI } from '../services/api'

export default function PersonalizeRoutine({ routine, student, onClose, onSave, showAlert }) {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadRoutineExercises()
  }, [routine])

  const loadRoutineExercises = async () => {
    try {
      setLoading(true)
      // Obtener los ejercicios de la rutina plantilla
      const ejercicios = await rutinasAPI.getEjercicios(routine.idRutina || routine.id)
      // Inicializar el estado con los valores de la plantilla
      setExercises(ejercicios.map(ej => ({
        idEjercicio: ej.idEjercicio,
        nombre: ej.nombre,
        unidad: ej.unidad,
        distancia: ej.distancia,
        duracion: ej.duracion,
        descripcionIntervalo: ej.descripcionIntervalo,
        cantSets: ej.cantSets,
        cantidad: ej.cantidad,
        orden: ej.orden,
        especificaciones: '',
        pausaSeries: ej.pausaSeries || '',
        intensidad: ej.intensidad || '',
        esCalentamiento: ej.esCalentamiento || 0
      })))
    } catch (error) {
      console.error('Error loading exercises:', error)
      showAlert('Error al cargar ejercicios', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleExerciseChange = (index, field, value) => {
    setExercises(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // 1. Primero asignar la rutina al alumno (esto copia los ejercicios)
      await rutinasAPI.assignToPersona(routine.idRutina || routine.id, student.id)
      
      // 2. Luego actualizar cada ejercicio con las personalizaciones
      const updatePromises = exercises.map(exercise => 
        rutinasAPI.updateAlumnoEjercicio(
          routine.idRutina || routine.id,
          student.id,
          exercise.idEjercicio,
          {
            cantSets: parseInt(exercise.cantSets),
            cantidad: parseInt(exercise.cantidad),
            especificaciones: exercise.especificaciones || null,
            pausaSeries: exercise.pausaSeries || null,
            intensidad: exercise.intensidad || null,
            esCalentamiento: exercise.esCalentamiento ? 1 : 0
          }
        )
      )
      
      await Promise.all(updatePromises)
      
      showAlert('Rutina personalizada y asignada exitosamente', 'success')
      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving personalized routine:', error)
      showAlert('Error al asignar rutina personalizada', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#1a1f3a] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-[#00BFFF]/20">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] p-6 border-b border-[#00BFFF]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-[#F3F4F6] flex items-center gap-2">
                <Dumbbell className="text-[#00BFFF]" size={28} />
                Personalizar Rutina
              </h3>
              <p className="text-[#00BFFF] mt-1">
                "{routine.nombre}" para {student.nombre}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              className="text-gray-400 hover:text-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              <X size={28} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto"></div>
              <p className="text-gray-400 mt-4">Cargando ejercicios...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 mb-4">
                Ajusta los valores de sets, cantidad y agrega especificaciones para cada ejercicio.
              </p>
              
              {exercises.map((exercise, index) => (
                <div
                  key={exercise.idEjercicio}
                  className="bg-[#0f1629] rounded-xl p-4 border border-[#00BFFF]/20 hover:border-[#00BFFF]/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-lg font-semibold text-[#F3F4F6] flex items-center gap-2">
                        <span className="text-[#00BFFF]">{index + 1}.</span>
                        {exercise.nombre}
                      </h4>
                      {/* Mostrar info del ejercicio base */}
                      <div className="mt-1 text-sm text-gray-400 space-y-1">
                        <div>Unidad: {exercise.unidad}</div>
                        {exercise.distancia && <div>Distancia: {exercise.distancia}</div>}
                        {exercise.duracion && <div>Duración: {exercise.duracion}</div>}
                        {exercise.descripcionIntervalo && (
                          <div className="text-[#00BFFF] italic">"{exercise.descripcionIntervalo}"</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Checkbox Calentamiento */}
                    <label className="flex items-center gap-2 cursor-pointer bg-[#1a1f3a] px-3 py-2 rounded-lg">
                      <input
                        type="checkbox"
                        checked={exercise.esCalentamiento === 1}
                        onChange={(e) => handleExerciseChange(index, 'esCalentamiento', e.target.checked ? 1 : 0)}
                        className="w-4 h-4 text-[#00BFFF] focus:ring-[#00BFFF] rounded"
                        disabled={saving}
                      />
                      <span className="text-sm text-gray-300">Calentamiento</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {/* Sets */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.cantSets}
                        onChange={(e) => handleExerciseChange(index, 'cantSets', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#00BFFF] transition-colors"
                        disabled={saving}
                      />
                    </div>

                    {/* Cantidad */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Cantidad ({exercise.unidad})
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.cantidad}
                        onChange={(e) => handleExerciseChange(index, 'cantidad', e.target.value)}
                        className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#00BFFF] transition-colors"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Campos de Running */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {/* Pausa entre series */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Pausa entre series
                      </label>
                      <input
                        type="text"
                        value={exercise.pausaSeries}
                        onChange={(e) => handleExerciseChange(index, 'pausaSeries', e.target.value)}
                        placeholder="Ej: 2', 90'', 1 min"
                        className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#00BFFF] transition-colors"
                        disabled={saving}
                      />
                    </div>

                    {/* Intensidad */}
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Intensidad
                      </label>
                      <input
                        type="text"
                        value={exercise.intensidad}
                        onChange={(e) => handleExerciseChange(index, 'intensidad', e.target.value)}
                        placeholder="Ej: suave, fuerte, moderado"
                        className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#00BFFF] transition-colors"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Especificaciones */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Especificaciones adicionales (opcional)
                    </label>
                    <textarea
                      value={exercise.especificaciones}
                      onChange={(e) => handleExerciseChange(index, 'especificaciones', e.target.value)}
                      placeholder="Ej: Rápidos el 3, 6 y 12, Hacer en colina, etc."
                      rows="2"
                      className="w-full px-3 py-2 bg-[#1a1f3a] border border-gray-600 rounded-lg text-[#F3F4F6] focus:outline-none focus:border-[#00BFFF] transition-colors resize-none"
                      disabled={saving}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 bg-[#0f1629] border-t-2 border-[#00BFFF]/30 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 bg-gray-600 text-[#F3F4F6] rounded-lg hover:bg-gray-700 transition-colors font-semibold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-3 bg-gradient-to-r from-[#1E40AF] to-[#00BFFF] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Asignando...
              </>
            ) : (
              <>
                <Save size={20} />
                Asignar Rutina
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
