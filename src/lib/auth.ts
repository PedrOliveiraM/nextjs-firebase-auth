import { FirestoreAdapter } from '@auth/firebase-adapter'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import { firebaseCert } from './firebase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, GitHub],
  adapter: FirestoreAdapter({
    credential: firebaseCert,
  }),
})
