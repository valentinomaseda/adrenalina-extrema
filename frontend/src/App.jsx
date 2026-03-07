import { AppProvider, useAppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import BottomNavbar from './components/BottomNavbar'
import StudentList from './views/StudentList'
import StudentDetail from './views/StudentDetail'
import RoutineBuilder from './views/RoutineBuilder'
import Profile from './views/Profile'
import Login from './views/Login'
import Register from './views/Register'
import AddStudent from './views/AddStudent'
import AddExercise from './views/AddExercise'
import StudentRoutines from './views/StudentRoutines'
import StudentProgress from './views/StudentProgress'

function AppContent() {
  const { currentView, isAuthenticated, user, showRegister } = useAppContext()

  // Si no está autenticado, mostrar login o registro
  if (!isAuthenticated) {
    return showRegister ? <Register /> : <Login />
  }

  // Renderizado basado en el rol del usuario
  const renderView = () => {
    // Vistas para alumnos
    if (user?.rol === 'alumno') {
      switch (currentView) {
        case 'studentRoutines':
          return <StudentRoutines />
        case 'studentProgress':
          return <StudentProgress />
        case 'profile':
          return <Profile />
        default:
          return <StudentRoutines />
      }
    }
    
    // Vistas para coaches/entrenadores
    switch (currentView) {
      case 'students':
        return <StudentList />
      case 'studentDetail':
        return <StudentDetail />
      case 'routines':
        return <RoutineBuilder />
      case 'profile':
        return <Profile />
      case 'addStudent':
        return <AddStudent />
      case 'addExercise':
        return <AddExercise />
      default:
        return <StudentList />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {user?.rol !== 'alumno' && <Sidebar />}
      
      <main className={`flex-1 ${user?.rol !== 'alumno' ? 'md:ml-64' : ''} overflow-y-auto`}>
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <BottomNavbar />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
