import { useState } from 'react'
import { UserCircle, Mail, Phone, Award, LogOut, X, Edit, MapPin, Cake, Weight, Ruler, User } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Profile() {
  const { user, students, logout, updateProfile, showConfirm, showAlert } = useAppContext()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState({})

  const handleLogout = () => {
    showConfirm(
      '¿Estás seguro que deseas cerrar sesión?',
      () => logout(),
      'Cerrar Sesión'
    )
  }

  const handleEditProfile = async (e) => {
    e.preventDefault()
    
    try {
      await updateProfile(editFormData)
      setShowEditModal(false)
      showAlert('Perfil actualizado exitosamente', 'success')
    } catch (error) {
      showAlert(error.message || 'Error al actualizar el perfil', 'error')
    }
  }

  return (
    <div className="p-4 space-y-6 pb-32 md:pb-6 animate-fade-in">
      <div className="flex items-center space-x-3 animate-slide-in-left">
        <UserCircle className="text-[#00BFFF]" size={28} strokeWidth={2.5} />
        <h2 className="text-2xl font-bold text-[#F3F4F6]">Mi Perfil</h2>
      </div>

      <div className="bg-gradient-to-br from-[#1E40AF] to-[#152e6b] rounded-xl shadow-lg p-6 space-y-6 animate-slide-in-up delay-100 border border-[#00BFFF]/20">
        <div className="flex flex-col items-center animate-scale-in delay-200">
          <div className="w-32 h-32 bg-[#00BFFF] rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {user?.photo ? (
              <img src={user.photo} alt={user.nombre} className="w-full h-full object-cover" />
            ) : (
              <UserCircle size={80} className="text-[#111827]" strokeWidth={2} />
            )}
          </div>
          <h3 className="text-2xl font-bold text-[#F3F4F6]">{user?.nombre || 'Coach Admin'}</h3>
          <p className="text-[#00BFFF] mt-1">
            {user?.rol === 'entrenador' ? 'Entrenador Principal' : 
             user?.rol === 'admin' ? 'Administrador' : 
             user?.rol === 'alumno' ? 'Alumno' : 'Usuario'}
          </p>
        </div>

        <div className="space-y-4 pt-6 border-t border-[#111827]">
          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-300">
            <Mail className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Email</p>
              <p className="font-semibold text-[#F3F4F6]">{user?.mail || 'coach@adrenalinaxtrema.com'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-400">
            <Phone className="text-[#00BFFF]" size={24} />
            <div>
              <p className="text-xs text-[#00BFFF]">Teléfono</p>
              <p className="font-semibold text-[#F3F4F6]">{user?.tel || 'No especificado'}</p>
            </div>
          </div>

          {user?.rol === 'alumno' ? (
            <>
              {user?.domicilio && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <MapPin className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Dirección</p>
                    <p className="font-semibold text-[#F3F4F6]">{user.domicilio}</p>
                  </div>
                </div>
              )}

              {user?.fechaNacimiento && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <Cake className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Fecha de Nacimiento</p>
                    <p className="font-semibold text-[#F3F4F6]">
                      {new Date(user.fechaNacimiento).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}

              {user?.genero && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <User className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Género</p>
                    <p className="font-semibold text-[#F3F4F6]">{user.genero === 'masculino' ? 'Masculino' : 'Femenino'}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {user?.peso && (
                  <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                    <Weight className="text-[#00BFFF]" size={24} />
                    <div>
                      <p className="text-xs text-[#00BFFF]">Peso</p>
                      <p className="font-semibold text-[#F3F4F6]">{user.peso} kg</p>
                    </div>
                  </div>
                )}

                {user?.altura && (
                  <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                    <Ruler className="text-[#00BFFF]" size={24} />
                    <div>
                      <p className="text-xs text-[#00BFFF]">Altura</p>
                      <p className="font-semibold text-[#F3F4F6]">{user.altura} cm</p>
                    </div>
                  </div>
                )}
              </div>

              {user?.nivel && (
                <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
                  <Award className="text-[#00BFFF]" size={24} />
                  <div>
                    <p className="text-xs text-[#00BFFF]">Nivel</p>
                    <p className="font-semibold text-[#F3F4F6]">{user.nivel}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-3 p-4 bg-[#111827] rounded-lg animate-slide-in-right delay-500">
              <Award className="text-[#00BFFF]" size={24} />
              <div>
                <p className="text-xs text-[#00BFFF]">Alumnos Activos</p>
                <p className="font-semibold text-[#F3F4F6]">{students?.length || 0} atletas</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => {
              setEditFormData({
                nombre: user?.nombre || '',
                mail: user?.mail || '',
                tel: user?.tel || '',
                domicilio: user?.domicilio || '',
                fechaNacimiento: user?.fechaNacimiento || '',
                peso: user?.peso || '',
                altura: user?.altura || '',
                genero: user?.genero || 'masculino',
                password: ''
              })
              setShowEditModal(true)
            }}
            className="w-full px-6 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold animate-fade-in delay-500 flex items-center justify-center gap-2"
          >
            <Edit size={20} />
            Editar Perfil
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all font-semibold animate-fade-in delay-600 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 pt-8 animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1729] rounded-xl shadow-2xl max-w-md w-full my-8 animate-scale-in border border-[#00BFFF]">
            <div className="sticky top-0 bg-[#1E40AF] text-white p-6 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold">Editar Perfil</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-[#00BFFF] rounded-full active:scale-95 transition-all"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            
            <form onSubmit={handleEditProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Nombre</label>
                <input
                  type="text"
                  value={editFormData.nombre || ''}
                  onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Email</label>
                <input
                  type="email"
                  value={editFormData.mail || ''}
                  onChange={(e) => setEditFormData({...editFormData, mail: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={editFormData.tel || ''}
                  onChange={(e) => setEditFormData({...editFormData, tel: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                />
              </div>

              {user?.rol === 'alumno' && (
                <>
                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Género</label>
                    <select
                      value={editFormData.genero || 'masculino'}
                      onChange={(e) => setEditFormData({...editFormData, genero: e.target.value})}
                      className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Domicilio</label>
                    <input
                      type="text"
                      value={editFormData.domicilio || ''}
                      onChange={(e) => setEditFormData({...editFormData, domicilio: e.target.value})}
                      className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#00BFFF] font-semibold mb-2">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={editFormData.fechaNacimiento || ''}
                      onChange={(e) => setEditFormData({...editFormData, fechaNacimiento: e.target.value})}
                      className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#00BFFF] font-semibold mb-2">Peso (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editFormData.peso || ''}
                        onChange={(e) => setEditFormData({...editFormData, peso: e.target.value})}
                        className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[#00BFFF] font-semibold mb-2">Altura (cm)</label>
                      <input
                        type="number"
                        value={editFormData.altura || ''}
                        onChange={(e) => setEditFormData({...editFormData, altura: e.target.value})}
                        className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-[#00BFFF] font-semibold mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={editFormData.password || ''}
                  onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-[#111827] text-[#F3F4F6] border-2 border-[#1E40AF] rounded-lg focus:border-[#00BFFF] focus:outline-none"
                  placeholder="Dejar vacío para no cambiar"
                />
                <p className="text-xs text-gray-400 mt-1">Solo completa este campo si deseas cambiar tu contraseña</p>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:scale-95 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#00BFFF] text-[#111827] rounded-lg hover:bg-[#1E40AF] hover:text-[#00BFFF] active:scale-95 transition-all font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
