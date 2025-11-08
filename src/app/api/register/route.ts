import { NextRequest, NextResponse } from 'next/server'
import { getUsersCollection } from '@/lib/azure'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  // Skip database operations during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 })
  }

  try {
    console.log('Parsing request JSON...')
    const { name, email, password } = await request.json()
    console.log('JSON parsed successfully:', { name, email, password: '***' })

    const usersCollection = await getUsersCollection()

    // Check if user exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    const result = await usersCollection.insertOne(user)

    return NextResponse.json({ message: 'User created successfully', userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}