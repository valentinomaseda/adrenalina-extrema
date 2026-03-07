import { Users, ClipboardList, UserCircle, Activity, TrendingUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function BottomNavbar() {
  const { currentView, setCurrentView, setSelectedStudent, user } = useAppContext()

  const handleNavigation = (view) => {
    setCurrentView(view)
    setSelectedStudent(null)
  }

  // Opciones de navegación para alumnos
  const studentNavItems = [
    { id: 'studentRoutines', label: 'Rutinas', icon: ClipboardList },
    { id: 'studentProgress', label: 'Progreso', icon: TrendingUp },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
  ]

  // Opciones de navegación para coaches
  const coachNavItems = [
    { id: 'students', label: 'Alumnos', icon: Users },
    { id: 'routines', label: 'Rutinas', icon: ClipboardList },
    { id: 'profile', label: 'Perfil', icon: UserCircle },
  ]

  const navItems = user?.rol === 'alumno' ? studentNavItems : coachNavItems

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1E40AF] shadow-lg z-50 animate-slide-in-up">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            onClick={() => handleNavigation(id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors active:scale-95 animate-fade-in ${
              currentView === id
                ? 'text-[#00BFFF] bg-[#1E40AF]'
                : 'text-[#F3F4F6] hover:text-[#00BFFF] hover:bg-[#1E40AF]'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Icon size={24} strokeWidth={2.5} />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
