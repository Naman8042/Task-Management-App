import NextAuth from 'next-auth'
import { connect } from '@/lib/dbConnect'
import { option } from './option'

connect()

const handler = NextAuth(option)

export { handler as GET, handler as POST }
