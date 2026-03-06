import { UserCircle, Mail, Phone, Award } from 'lucide-react'

export default function Profile() {
  return (
    <div className="p-4 space-y-6 pb-24 md:pb-6">
      <div className="flex items-center space-x-3">
        <UserCircle className="text-primary" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserCircle size={80} className="text-white" strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Coach Admin</h3>
          <p className="text-gray-600 mt-1">Entrenador Principal</p>
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Mail className="text-primary" size={24} />
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">coach@adrenalinaxtrema.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Phone className="text-primary" size={24} />
            <div>
              <p className="text-xs text-gray-600">Teléfono</p>
              <p className="font-semibold text-gray-900">+54 9 11 1234-5678</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Award className="text-primary" size={24} />
            <div>
              <p className="text-xs text-gray-600">Alumnos Activos</p>
              <p className="font-semibold text-gray-900">5 atletas</p>
            </div>
          </div>
        </div>

        <button className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 active:scale-95 transition-all font-semibold">
          Editar Perfil
        </button>
      </div>
    </div>
  )
}
