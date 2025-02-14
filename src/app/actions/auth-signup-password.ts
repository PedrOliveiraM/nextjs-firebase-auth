import clientApp from '@/lib/firebaseClient'
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth'

export const signupWithPassword = async (
  username: string,
  email: string,
  password: string,
) => {
  try {
    const auth = getAuth(clientApp)

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    )

    await updateProfile(userCredential.user, { displayName: username })

    console.log('User created successfully:', userCredential.user)
    return userCredential.user
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
  }
}
