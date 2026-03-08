import { useState } from 'react'
import { Dumbbell, ArrowLeft, Loader2 } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function AddExercise() {
  const { addExercise, setCurrentView, showAlert } = useAppContext()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    tipoContador: 'reps'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await addExercise(formData)
      showAlert('Ejercicio creado exitosamente', 'success')
      setCurrentView('routines')
    } catch (err) {
      showAlert(err.message || 'Error al crear el ejercicio', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 pb-32 md:pb-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('routines')}
            className="flex items-center gap-2 text-[#1E40AF] hover:text-[#00BFFF] transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Volver a Rutinas</span>
          </button>
          <h1 className="text-3xl font-black text-[#F3F4F6] flex items-center gap-3">
            <Dumbbell className="text-[#00BFFF]" size={36} />
            Agregar Nuevo Ejercicio
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl p-6 md:p-8 border-2 border-[#1E40AF]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Ejercicio */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Nombre del Ejercicio *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-[#F3F4F6] bg-[#0f1729] w-full px-4 py-3 border-2 border-[#1E40AF] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Ej: Burpees, Sentadillas, Plancha..."
              />
            </div>

            {/* Tipo de Contador */}
            <div>
              <label className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                ¿Cómo se mide este ejercicio? *
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoContador"
                    value="reps"
                    checked={formData.tipoContador === 'reps'}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#00BFFF] focus:ring-[#00BFFF]"
                  />
                  <span className="text-[#F3F4F6] text-lg">Repeticiones</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="tipoContador"
                    value="segundos"
                    checked={formData.tipoContador === 'segundos'}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#00BFFF] focus:ring-[#00BFFF]"
                  />
                  <span className="text-[#F3F4F6] text-lg">Tiempo (segundos)</span>
                </label>
              </div>
              <p className="text-sm text-[#9CA3AF] mt-2">
                Las cantidades específicas (sets, reps/segundos) se asignarán al agregar el ejercicio a una rutina.
              </p>
            </div>

            {/* Vista Previa */}
            <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-lg p-6 border-2 border-[#00BFFF]">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Vista Previa:</h3>
              <div className="space-y-2">
                <p className="text-xl font-bold text-[#F3F4F6]">
                  {formData.name || 'Nombre del Ejercicio'}
                </p>
                <p className="text-lg text-gray-300">
                  Se mide en: <span className="font-semibold text-[#00BFFF]">
                    {formData.tipoContador === 'reps' ? 'Repeticiones' : 'Segundos'}
                  </span>
                </p>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentView('routines')}
                disabled={loading}
                className="flex-1 bg-gray-700 text-[#F3F4F6] font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white font-bold py-3 px-6 rounded-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Dumbbell size={20} />
                    Crear Ejercicio
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
