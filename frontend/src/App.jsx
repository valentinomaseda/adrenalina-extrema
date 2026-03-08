import { AppProvider, useAppContext } from './context/AppContext'
import Sidebar from './components/Sidebar'
import BottomNavbar from './components/BottomNavbar'
import Header from './components/Header'
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
import VerifyEmail from './views/VerifyEmail'
import ForgotPassword from './views/ForgotPassword'
import ResetPassword from './views/ResetPassword'
import PendingEmailVerification from './views/PendingEmailVerification'

function AppContent() {
  const { currentView, isAuthenticated, user, showRegister, authView, setAuthView, pendingEmailData } = useAppContext()

  // Si no está autenticado, mostrar vistas de autenticación
  if (!isAuthenticated) {
    // Verificar si hay un token en la URL para verificación de email o reset
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const pathname = window.location.pathname;
    
    // Si hay un token en la URL, determinar si es para verify-email o reset-password
    if (token) {
      // Detectar si es reset-password por la ruta
      if (pathname.includes('reset-password') || authView === 'reset-password') {
        return <ResetPassword 
          onBackToLogin={() => setAuthView('login')} 
          onGoToForgotPassword={() => setAuthView('forgot-password')} 
        />;
      }
      // Si es verify-email (por defecto)
      return <VerifyEmail onBackToLogin={() => setAuthView('login')} />;
    }
    
    switch (authView) {
      case 'register':
        return <Register />;
      case 'forgot-password':
        return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
      case 'reset-password':
        return <ResetPassword 
          onBackToLogin={() => setAuthView('login')} 
          onGoToForgotPassword={() => setAuthView('forgot-password')} 
        />;
      case 'verify-email':
        return <VerifyEmail onBackToLogin={() => setAuthView('login')} />;
      case 'pending-verification':
        return <PendingEmailVerification 
          email={pendingEmailData.email}
          nombre={pendingEmailData.nombre}
          onBackToLogin={() => setAuthView('login')} 
        />;
      default:
        return showRegister ? <Register /> : <Login />;
    }
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
    <div className="flex h-screen bg-[#0a0e1a]">
      {/* Header fijo en la parte superior */}
      <Header />
      
      {user && <Sidebar />}
      
      <main className={`flex-1 ${user ? 'md:ml-64' : ''} overflow-y-auto pt-16`}>
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
