import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/azure'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  // Prevent execution during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
  }

  try {
    const { username, password } = await request.json()

    const usersCollection = await getUsersCollection()

    const user = await usersCollection.findOne({ username })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Compare hashed password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      name: user.name
    })

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}