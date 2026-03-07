import { useState } from 'react'
import { Dumbbell, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function AddExercise() {
  const { addExercise, setCurrentView } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
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
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await addExercise(formData)
      setSuccess(true)
      
      // Volver a rutinas después de 2 segundos
      setTimeout(() => {
        setCurrentView('routines')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al crear el ejercicio')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Ejercicio creado exitosamente!
          </h2>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-32 md:pb-6 animate-fade-in">
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
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <Dumbbell className="text-[#00BFFF]" size={36} />
            Agregar Nuevo Ejercicio
          </h1>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-[#1E40AF]">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-700 animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Ejercicio */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Ejercicio *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-gray-900 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Ej: Burpees, Sentadillas, Plancha..."
              />
            </div>

            {/* Tipo de Contador */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                  <span className="text-gray-700 text-lg">Repeticiones</span>
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
                  <span className="text-gray-700 text-lg">Tiempo (segundos)</span>
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">
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
                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
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
