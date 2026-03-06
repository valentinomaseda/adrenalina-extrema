import { Users, ClipboardList, UserCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Sidebar() {
  const { currentView, setCurrentView, setSelectedStudent } = useAppContext()

  const handleNavigation = (view) => {
    setCurrentView(view)
    setSelectedStudent(null)
  }

  const navItems = [
    { id: 'students', label: 'Alumnos', icon: Users },
    { id: 'routines', label: 'Rutinas', icon: ClipboardList },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
  ]

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary">Adrenalina Extrema</h1>
        <p className="text-sm text-gray-600 mt-1">Dashboard Coach</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNavigation(id)}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all hover:scale-105 active:scale-95 ${
              currentView === id
                ? 'bg-primary text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon size={22} strokeWidth={2.5} />
            <span className="font-semibold">{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <UserCircle size={32} className="text-primary" strokeWidth={2} />
          <div>
            <p className="font-semibold text-sm">Coach Admin</p>
            <p className="text-xs text-gray-500">Sesión activa</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
