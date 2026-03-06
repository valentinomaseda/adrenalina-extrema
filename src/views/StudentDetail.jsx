import { ArrowLeft, TrendingUp, Calendar, CheckCircle2, XCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppContext } from '../context/AppContext'

export default function StudentDetail() {
  const { selectedStudent, setCurrentView, setSelectedStudent } = useAppContext()

  if (!selectedStudent) {
    return (
      <div className="p-4">
        <p className="text-center text-gray-500">No se ha seleccionado ningún alumno</p>
      </div>
    )
  }

  const handleBack = () => {
    setSelectedStudent(null)
    setCurrentView('students')
  }

  // Preparar datos para el gráfico
  const chartData = selectedStudent.progress.map((value, index) => ({
    sesion: `S${index + 1}`,
    rendimiento: value,
  }))

  return (
    <div className="p-4 space-y-6 pb-24 md:pb-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Detalle del Alumno</h2>
      </div>

      {/* Card del alumno */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={selectedStudent.photo}
            alt={selectedStudent.name}
            className="w-24 h-24 rounded-full border-4 border-primary"
          />
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedStudent.level === 'Avanzado'
                    ? 'bg-green-100 text-green-800'
                    : selectedStudent.level === 'Intermedio'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {selectedStudent.level}
              </span>
            </p>
          </div>
        </div>

        {/* Gráfico de progreso */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="text-primary" size={20} />
            <h4 className="text-lg font-semibold text-gray-800">Progreso Reciente</h4>
          </div>
          <div className="bg-gray-50 rounded-lg p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sesion" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rendimiento"
                  stroke="#FF5722"
                  strokeWidth={3}
                  dot={{ fill: '#FF5722', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {selectedStudent.progress[selectedStudent.progress.length - 1]}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Último rendimiento</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-secondary">
              {Math.round(selectedStudent.progress.reduce((a, b) => a + b, 0) / selectedStudent.progress.length)}%
            </p>
            <p className="text-xs text-gray-600 mt-1">Promedio</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center col-span-2 md:col-span-1">
            <p className="text-3xl font-bold text-green-600">
              {selectedStudent.routineHistory.filter((r) => r.completed).length}
            </p>
            <p className="text-xs text-gray-600 mt-1">Rutinas completadas</p>
          </div>
        </div>
      </div>

      {/* Historial de rutinas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calendar className="text-primary" size={20} />
          <h4 className="text-lg font-semibold text-gray-800">Historial de Rutinas</h4>
        </div>

        {selectedStudent.routineHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay rutinas asignadas aún</p>
        ) : (
          <div className="space-y-3">
            {selectedStudent.routineHistory.map((routine) => (
              <div
                key={routine.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
              >
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900">{routine.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{routine.date}</p>
                </div>
                <div>
                  {routine.completed ? (
                    <CheckCircle2 className="text-green-600" size={28} strokeWidth={2.5} />
                  ) : (
                    <XCircle className="text-gray-400" size={28} strokeWidth={2.5} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
