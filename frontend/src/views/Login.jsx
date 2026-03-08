import { useState } from 'react'
import { Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Login() {
  const { login, setShowRegister, showAlert } = useAppContext()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      showAlert(err.message || 'Error al iniciar sesión', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-35 h-35 bg-gradient-to-br from-[#00BFFF] to-[#1E40AF] rounded-full mb-4 shadow-2xl">
            <img src="/logo-png.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl font-black text-[#F3F4F6] mb-2">
            Adrenalina Extrema
          </h1>
          <p className="text-lg text-gray-400">Plataforma de Entrenamiento</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-2xl shadow-2xl p-8 border-2 border-[#00BFFF]">
          <h2 className="text-2xl font-bold text-[#F3F4F6] mb-6 text-center">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-[#F3F4F6]">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00BFFF]" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-[#F3F4F6]">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00BFFF]" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 border-2 border-[#111827] rounded-lg focus:ring-2 focus:ring-[#00BFFF] focus:border-transparent text-lg bg-[#111827] text-[#F3F4F6] placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00BFFF] transition"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#00BFFF] to-[#1E40AF] text-white font-bold py-3 px-6 rounded-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Link de registro */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setShowRegister(true)}
                className="text-[#00BFFF] hover:text-[#1E40AF] font-semibold transition-colors"
              >
                Regístrate aquí
              </button>
            </p>
          </div>

          {/* Info adicional */}
          <div className="mt-6 pt-6 border-t border-[#111827]">
            <p className="text-sm text-gray-400 text-center">
              ¿Problemas para acceder? Contacta con el administrador
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            © 2026 Adrenalina Extrema. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
