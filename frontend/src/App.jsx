import { AppProvider, useAppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import BottomNavbar from './components/BottomNavbar'
import StudentList from './views/StudentList'
import StudentDetail from './views/StudentDetail'
import RoutineBuilder from './views/RoutineBuilder'
import Profile from './views/Profile'
import Login from './views/Login'
import AddStudent from './views/AddStudent'
import AddExercise from './views/AddExercise'

function AppContent() {
  const { currentView, isAuthenticated } = useAppContext()

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login />
  }

  const renderView = () => {
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
      <Sidebar />
      
      <main className="flex-1 md:ml-64 overflow-y-auto">
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
