import clientApp from '@/lib/firebaseClient'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

export async function signInWithPassword(email: string, password: string) {
  try {
    const auth = getAuth(clientApp)
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    )

    return userCredential.user
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    throw new Error('Falha ao autenticar usuário. Verifique suas credenciais.')
  }
}
