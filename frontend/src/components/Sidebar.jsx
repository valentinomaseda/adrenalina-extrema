import { Users, ClipboardList, UserCircle, LogOut } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Sidebar() {
  const { currentView, setCurrentView, setSelectedStudent, logout, user, showConfirm } = useAppContext()

  const handleNavigation = (view) => {
    setCurrentView(view)
    setSelectedStudent(null)
  }

  const handleLogout = () => {
    showConfirm(
      '¿Estás seguro que deseas cerrar sesión?',
      () => logout(),
      'Cerrar Sesión'
    )
  }

  const navItems = [
    { id: 'students', label: 'Alumnos', icon: Users },
    { id: 'routines', label: 'Rutinas', icon: ClipboardList },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#111827] border-r border-[#1E40AF] shadow-sm h-[calc(100vh-4rem)] fixed left-0 top-16 animate-slide-in-left">
      <div className="p-6 border-b border-[#1E40AF] animate-fade-in delay-200">
        <p className="text-lg font-bold text-[#00BFFF]">Dashboard Coach</p>
        {user?.nombre && (
          <p className="text-sm text-[#F3F4F6] mt-1">Bienvenido, {user.nombre.split(' ')[0]}</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            onClick={() => handleNavigation(id)}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all hover:scale-105 active:scale-95 animate-slide-in-left ${
              currentView === id
                ? 'bg-[#00BFFF] text-[#111827] shadow-md'
                : 'text-[#F3F4F6] hover:bg-[#1E40AF]'
            }`}
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
          >
            <Icon size={22} strokeWidth={2.5} />
            <span className="font-semibold">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1E40AF] space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-[#1E40AF] rounded-lg">
          <UserCircle size={32} className="text-[#00BFFF]" strokeWidth={2} />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-[#F3F4F6] truncate">{user?.nombre || 'Coach Admin'}</p>
            <p className="text-xs text-[#00BFFF]">Sesión activa</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all"
        >
          <LogOut size={20} />
          <span className="font-semibold text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
