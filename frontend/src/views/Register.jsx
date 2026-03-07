import { useState } from 'react'
import { UserPlus, ArrowLeft, Loader2, CheckCircle, Mail, Lock, User, Phone, Calendar, MapPin } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Register() {
  const { register, setShowRegister } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: 'masculino',
    phone: '',
    weight: '',
    height: '',
    address: '',
    birthDate: ''
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

    // Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      await register(formData)
      setSuccess(true)
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        setShowRegister(false)
      }, 2000)
    } catch (err) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <CheckCircle className="mx-auto text-[#00BFFF] mb-4" size={64} />
          <h2 className="text-2xl font-bold text-[#F3F4F6] mb-2">
            ¡Registro exitoso!
          </h2>
          <p className="text-gray-400">Redirigiendo al inicio de sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowRegister(false)}
            className="flex items-center gap-2 text-[#00BFFF] hover:text-[#1E40AF] transition mb-6 mx-auto"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio de sesión</span>
          </button>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#1E40AF] rounded-full mb-4 shadow-2xl">
            <UserPlus className="text-white" size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-[#F3F4F6] mb-2">
            Registro de Alumno
          </h1>
          <p className="text-lg text-gray-400">Crea tu cuenta para acceder a tus rutinas</p>
        </div>

        {/* Formulario */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-2xl shadow-2xl p-8 border-2 border-[#00BFFF]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center gap-2 animate-shake">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                <User className="inline mr-2" size={16} />
                Nombre Completo *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                placeholder="Juan Pérez"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                <Mail className="inline mr-2" size={16} />
                Correo Electrónico *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                placeholder="juan@email.com"
              />
            </div>

            {/* Género */}
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                Género *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] disabled:opacity-50"
              >
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
              </select>
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  <Lock className="inline mr-2" size={16} />
                  Contraseña *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  <Lock className="inline mr-2" size={16} />
                  Confirmar Contraseña *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                <Phone className="inline mr-2" size={16} />
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                placeholder="+54 9 11 1234-5678"
              />
            </div>

            {/* Peso y Altura */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  Peso (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                  placeholder="70"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                  Altura (cm)
                </label>
                <input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                <Calendar className="inline mr-2" size={16} />
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] disabled:opacity-50"
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-[#F3F4F6] mb-2">
                <MapPin className="inline mr-2" size={16} />
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50"
                placeholder="Av. Corrientes 1234, CABA"
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white font-bold py-3 px-6 rounded-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Registrando...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Link a login */}
          <div className="mt-6 pt-6 border-t border-[#111827]">
            <p className="text-sm text-gray-400 text-center">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => setShowRegister(false)}
                className="text-[#00BFFF] hover:text-[#1E40AF] font-semibold transition"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
