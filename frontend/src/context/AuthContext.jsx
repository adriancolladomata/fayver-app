import { createContext, useState, useEffect, useContext } from 'react'
import { getMeReq, loginReq, registerReq } from '../services/authService.js'

// createContext() te permite crear un contexto que los componentes pueden proporcionar o leer.
// Puedes llamar a createContext() fuera de cualquier componente para crear un contexto.
const AuthContext = createContext()

// AuthProvider es un componente especial. children representa toda la aplicación (app, Páginas, etc.)
// Todo lo que se meta dentro de AuthProvider tendrá acceso a los datos
export const AuthProvider = ({ children }) => {
  // Variable que guarda los datos del usuario (nombre, id) Empieza en null. setUser es la función que cambia ese valor.
  const [user, setUser] = useState(null)
  // Variable que indica si está cargando o no.
  const [loading, setLoading] = useState(true)

  // Autocheck al cargar la página web. Esto se ejecuta una sola vez al abrir la página.
  // LLama a getMeReq(). Si el backend dice "OK", entonces la cookie es válida, y setUser guarda al usuario. Si falla, el user seguirá siendo null
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getMeReq
        setUser(res.data)
      } catch (error) {
        setUser(null) // Si falla, no hay usuario logueado
      } finally {
        setLoading(false)
      }
    }
    checkUser()
  }, [])

  // Llama a loginReq, y si el backend responde con exito, enviamos la información al usaurio y actualizamos su estado
  const login = async (email, password) => {
    const res = await loginReq(email, password)
    setUser(res.data)
  }

  // Llama a registerReq, y si el backend responde con exito, muestra un mensaje de éxito
  const register = async (name, email, password, confirmPassword) => {
    const res = await registerReq(name, email, password, confirmPassword)
    return res
  }

  // Introducimos los datos en el contexto. Compartimos el objeto user, la funcion login, la función register y el estado loading
  return (
    <AuthContext.Provider value={{ user, login, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Es un hook personalizado. Asi no tenemos que importar useContext y AuthContext cada vez. COn escribir useAuth() ya tenemos los datos
export const useAuth = () => useContext(AuthContext)
