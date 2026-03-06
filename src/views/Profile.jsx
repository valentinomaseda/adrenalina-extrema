import { UserCircle, Mail, Phone, Award } from 'lucide-react'

export default function Profile() {
  return (
    <div className="p-4 space-y-6 pb-24 md:pb-6">
      <div className="flex items-center space-x-3">
        <UserCircle className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#1E40AF]">Mi Perfil</h2>
      </div>

      <div className="bg-[#1E40AF] rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-[#00BFFF] rounded-full flex items-center justify-center mb-4">
            <UserCircle size={80} className="text-[#111827]" strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-[#F3F4F6]">Coach Admin</h3>
          <p className="text-[#00BFFF] mt-1">Entrenador Principal</p>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#111827]">
          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg">
            <Mail className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Email</p>
              <p className="font-semibold text-[#F3F4F6]">coach@adrenalinaxtrema.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg">
            <Phone className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Teléfono</p>
              <p className="font-semibold text-[#F3F4F6]">+54 9 11 1234-5678</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg">
            <Award className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Alumnos Activos</p>
              <p className="font-semibold text-[#F3F4F6]">5 atletas</p>
            </div>
          </div>
        </div>

        <button className="w-full px-6 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold">
          Editar Perfil
        </button>
      </div>
    </div>
  )
}
