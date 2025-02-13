import clientApp from '@/lib/firebaseClient'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'

export const signupWithPassword = async (email: string, password: string) => {
  try {
    const auth = getAuth(clientApp)
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )
    console.log('User created successfully:', userCredential.user)
    return userCredential.user
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error creating user: ${error.message}`)
      throw new Error(error.message)
    }
  }
}
