import { UserCircle, Mail, Phone, Award, LogOut } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Profile() {
  const { user, students, logout } = useAppContext()

  const handleLogout = () => {
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout()
    }
  }

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <UserCircle className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#1E40AF]">Mi Perfil</h2>
      </div>

      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 space-y-6 animate-slide-in-up delay-100 border border-[#00BFFF]/20">
        <div className="flex flex-col items-center animate-scale-in delay-200">
          <div className="w-32 h-32 bg-[#00BFFF] rounded-full flex items-center justify-center mb-4">
            <UserCircle size={80} className="text-[#111827]" strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-[#F3F4F6]">{user?.nombre || 'Coach Admin'}</h3>
          <p className="text-[#00BFFF] mt-1">
            {user?.rol === 'entrenador' ? 'Entrenador Principal' : 
             user?.rol === 'admin' ? 'Administrador' : 'Usuario'}
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#111827]">
          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-300">
            <Mail className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Email</p>
              <p className="font-semibold text-[#F3F4F6]">{user?.mail || 'coach@adrenalinaxtrema.com'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-400">
            <Phone className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Teléfono</p>
              <p className="font-semibold text-[#F3F4F6]">{user?.tel || 'No especificado'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
            <Award className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Alumnos Activos</p>
              <p className="font-semibold text-[#F3F4F6]">{students?.length || 0} atletas</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full px-6 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold animate-fade-in delay-500">
            Editar Perfil
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all font-semibold animate-fade-in delay-600 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
