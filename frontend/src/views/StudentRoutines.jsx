import { useState, useEffect } from 'react'
import { Dumbbell, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function StudentRoutines() {
  const { user, myRoutines, updateRoutineStatus, loadMyRoutines, loading } = useAppContext()
  const [expandedRoutine, setExpandedRoutine] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Cargar rutinas cuando el componente se monte
  useEffect(() => {
    if (user && user.rol === 'alumno' && (!myRoutines || myRoutines.length === 0)) {
      loadMyRoutines(user)
    }
  }, [user])

  const handleStatusUpdate = async (routineId, newStatus) => {
    setUpdatingStatus(routineId)
    try {
      await updateRoutineStatus(routineId, newStatus)
    } catch (error) {
      console.error('Error updating routine status:', error)
      alert('Error al actualizar el estado de la rutina')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completada':
        return 'bg-green-600 border-green-400'
      case 'incompleta':
        return 'bg-yellow-600 border-yellow-400'
      case 'activa':
      default:
        return 'bg-[#1E40AF] border-[#00BFFF]'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completada':
        return <CheckCircle2 className="text-green-400" size={28} strokeWidth={2.5} />
      case 'incompleta':
        return <Clock className="text-yellow-400" size={28} strokeWidth={2.5} />
      case 'activa':
      default:
        return <XCircle className="text-gray-400" size={28} strokeWidth={2.5} />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completada':
        return 'Completada'
      case 'incompleta':
        return 'Incompleta'
      case 'activa':
      default:
        return 'Pendiente'
    }
  }

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <Dumbbell className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#1E40AF]">Mis Rutinas</h2>
      </div>

      {/* Saludo */}
      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 animate-slide-in-up border border-[#00BFFF]/20">
        <div className="flex items-center space-x-4 mb-2">
          {user?.photo && (
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#00BFFF]">
              <img src={user.photo} alt={user.nombre} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-[#F3F4F6]">
              ¡Hola, {user?.nombre?.split(' ')[0] || 'Atleta'}! 💪
            </h3>
            <p className="text-[#00BFFF]">
              Tienes {myRoutines?.filter(r => r.status === 'activa').length || 0} {myRoutines?.filter(r => r.status === 'activa').length === 1 ? 'rutina pendiente' : 'rutinas pendientes'}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de rutinas */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-12 text-center animate-pulse border border-[#00BFFF]/20">
            <Dumbbell className="mx-auto text-[#00BFFF] mb-4 animate-bounce" size={64} strokeWidth={2} />
            <h3 className="text-xl font-bold text-[#F3F4F6] mb-2">
              Cargando tus rutinas...
            </h3>
          </div>
        ) : !myRoutines || myRoutines.length === 0 ? (
          <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-12 text-center animate-scale-in border border-[#00BFFF]/20">
            <Dumbbell className="mx-auto text-[#00BFFF] mb-4" size={64} strokeWidth={2} />
            <h3 className="text-xl font-bold text-[#F3F4F6] mb-2">
              No tienes rutinas asignadas
            </h3>
            <p className="text-gray-400">
              Tu entrenador te asignará rutinas pronto. ¡Mantente atento!
            </p>
          </div>
        ) : (
          myRoutines.map((routine, index) => (
            <div
              key={routine.id}
              className={`bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-lg overflow-hidden animate-slide-in-up border-2 ${getStatusColor(routine.status)}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header de la rutina */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#F3F4F6] mb-1">{routine.name}</h3>
                    <p className="text-sm text-[#00BFFF]">
                      Asignada: {routine.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(routine.status)}
                    <button
                      onClick={() => setExpandedRoutine(expandedRoutine === routine.id ? null : routine.id)}
                      className="p-2 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all"
                    >
                      {expandedRoutine === routine.id ? (
                        <ChevronUp size={20} strokeWidth={2.5} />
                      ) : (
                        <ChevronDown size={20} strokeWidth={2.5} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Estado actual */}
                <div className="flex items-center justify-between p-3 bg-[#111827] rounded-lg mb-4">
                  <span className="text-[#F3F4F6] font-semibold">Estado:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    routine.status === 'completada' ? 'bg-green-600 text-white' :
                    routine.status === 'incompleta' ? 'bg-yellow-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {getStatusText(routine.status)}
                  </span>
                </div>

                {/* Botones de estado */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleStatusUpdate(routine.id, 'completada')}
                    disabled={updatingStatus === routine.id || routine.status === 'completada'}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                      routine.status === 'completada'
                        ? 'bg-green-600 text-white'
                        : 'bg-[#111827] text-[#F3F4F6] hover:bg-green-600 hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    ✓ Completada
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(routine.id, 'incompleta')}
                    disabled={updatingStatus === routine.id || routine.status === 'incompleta'}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                      routine.status === 'incompleta'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-[#111827] text-[#F3F4F6] hover:bg-yellow-600 hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    ◐ Incompleta
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(routine.id, 'activa')}
                    disabled={updatingStatus === routine.id || routine.status === 'activa'}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
                      routine.status === 'activa'
                        ? 'bg-gray-600 text-white'
                        : 'bg-[#111827] text-[#F3F4F6] hover:bg-gray-600 hover:text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    ○ Pendiente
                  </button>
                </div>
              </div>

              {/* Detalles de ejercicios (expandible) */}
              {expandedRoutine === routine.id && (
                <div className="border-t-2 border-[#111827] p-6 bg-[#111827]/30 animate-slide-in-up">
                  <h4 className="text-lg font-bold text-[#00BFFF] mb-4">
                    Ejercicios ({routine.exercises?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {routine.exercises && routine.exercises.length > 0 ? (
                      routine.exercises.map((exercise, idx) => (
                        <div
                          key={idx}
                          className="bg-[#111827] rounded-lg p-4 border-2 border-[#1E40AF]"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h5 className="font-bold text-[#F3F4F6] mb-1">
                                {idx + 1}. {exercise.name}
                              </h5>
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="px-2 py-1 bg-[#1E40AF] text-[#00BFFF] rounded font-semibold">
                                  {exercise.sets} {exercise.sets === 1 ? 'serie' : 'series'}
                                </span>
                                <span className="px-2 py-1 bg-[#1E40AF] text-[#00BFFF] rounded font-semibold">
                                  {exercise.value} {exercise.type === 'reps' ? 'repeticiones' : 'segundos'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-center py-4">
                        No hay ejercicios en esta rutina
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
