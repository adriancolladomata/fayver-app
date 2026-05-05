import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export const LoginPage = () => {
  // Guardamos lo que el usaurio escribe en los inputs en tiempo real
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    // Evita que la página se recargue.
    e.preventDefault()
    try {
      // Esta funcion viene de AuthContext. Si el login sale bien, envia un alert especifico.
      await login(email, password)
      alert('Has iniciado sesión en Fayver')
    } catch (error) {
      // Si el login sale mal. Envia un console.log con el error y un alert.
      console.log('ERROR DETALLADO: ', error.response?.data)
      alert(error.response?.data?.message || 'Error al entrar')
    }
  }

  return (
    <div className='login-container'>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <input type='email' placeholder='Email' onChange={e => setEmail(e.target.value)} />
        <input type='password' placeholder='Contraseña' onChange={e => setPassword(e.target.value)} />
        <button type='submit'>Entrar</button>
      </form>
    </div>
  )
}
