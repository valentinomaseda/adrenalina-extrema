import { useState } from 'react'
import { UserPlus, ArrowLeft, Loader2, CheckCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function AddStudent() {
  const { addStudent, setCurrentView } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weight: '',
    height: '',
    address: '',
    birthDate: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await addStudent(formData)
      setSuccess(true)
      
      // Resetear formulario y volver a la lista después de 2 segundos
      setTimeout(() => {
        setCurrentView('students')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al crear el alumno')
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
            ¡Alumno creado exitosamente!
          </h2>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('students')}
            className="flex items-center gap-2 text-[#1E40AF] hover:text-[#00BFFF] transition mb-4"
          >
            <ArrowLeft size={20} />
            <span>Volver a Alumnos</span>
          </button>
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <UserPlus className="text-[#00BFFF]" size={36} />
            Agregar Nuevo Alumno
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
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Juan Pérez"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="juan@email.com"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Dejar vacío para usar contraseña por defecto"
              />
              <p className="text-sm text-gray-500 mt-1">Si no se especifica, se usará "123456"</p>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            {/* Peso y Altura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700 mb-2">
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                  placeholder="70"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="text-gray-700 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg"
                placeholder="Av. Corrientes 1234, CABA"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setCurrentView('students')}
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
                    <UserPlus size={20} />
                    Crear Alumno
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
