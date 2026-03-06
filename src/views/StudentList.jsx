import { useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import SkeletonLoader from '../components/SkeletonLoader'

export default function StudentList() {
  const { students, setCurrentView, setSelectedStudent } = useAppContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || student.level === levelFilter
    return matchesSearch && matchesLevel
  })

  const handleStudentClick = (student) => {
    setLoading(true)
    setTimeout(() => {
      setSelectedStudent(student)
      setCurrentView('studentDetail')
      setLoading(false)
    }, 300)
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
        <SkeletonLoader type="card" />
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Buscador */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar alumno..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
          />
        </div>

        {/* Filtro de nivel */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full md:w-48 pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg appearance-none bg-white cursor-pointer"
          >
            <option value="all">Todos los niveles</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>
      </div>

      {/* Lista de alumnos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <button
            key={student.id}
            onClick={() => handleStudentClick(student)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-left hover:scale-105 active:scale-95 border-2 border-transparent hover:border-primary"
          >
            <div className="flex items-center space-x-4">
              <img
                src={student.photo}
                alt={student.name}
                className="w-16 h-16 rounded-full border-4 border-primary"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      student.level === 'Avanzado'
                        ? 'bg-green-100 text-green-800'
                        : student.level === 'Intermedio'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {student.level}
                  </span>
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                {student.routineHistory.length} rutina(s) asignada(s)
              </p>
            </div>
          </button>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron alumnos</p>
        </div>
      )}
    </div>
  )
}
