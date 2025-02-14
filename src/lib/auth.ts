import { signInFormSchema } from '@/@types/signInFormSchema'
import { FirestoreAdapter } from '@auth/firebase-adapter'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { ZodError } from 'zod'
import { firebaseCert } from './firebase'
import clientApp from './firebaseClient'

type CustomUser = {
  id: string
  name: string | null
  email: string | null
  image?: string | null
  accessToken: string
  refreshToken?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing email or password')
            return null
          }

          const { email, password } =
            await signInFormSchema.parseAsync(credentials)

          const auth = getAuth(clientApp)
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          )

          const user = userCredential.user
          if (!user) return null

          console.log('token:', await user.getIdToken())
          return {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
            accessToken: await user.getIdToken(),
            refreshToken: user.refreshToken,
          } as CustomUser
        } catch (error) {
          if (error instanceof ZodError) {
            console.error('Zod Validation Error:', error.errors)
            return null
          }
          return null
        }
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
  pages: {
    signIn: '/signIn',
    signOut: '/',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('@ JWT User:', user)
      if (user) {
        const customUser = user as CustomUser
        token.accessToken = customUser.accessToken
        token.refreshToken = customUser.refreshToken
      }
      console.log('$ TOKEN $ = ', token)
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
})
