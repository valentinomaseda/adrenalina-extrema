import { Users, ClipboardList, UserCircle } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function BottomNavbar() {
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNavigation(id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 ${
              currentView === id
                ? 'text-primary bg-orange-50'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
