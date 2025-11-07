import { NextRequest, NextResponse } from 'next/server'
import { getUsersContainer } from '@/lib/azure'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  // Skip database operations during build time
  if (!process.env.AZURE_COSMOS_CONNECTION_STRING) {
    return NextResponse.json({ error: 'Service unavailable during build' }, { status: 503 })
  }

  try {
    const { name, email, password } = await request.json()

    const usersContainer = getUsersContainer()
    if (!usersContainer) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Check if user exists
    const { resources: existingUsers } = await usersContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }]
      })
      .fetchAll()

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Hash password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    await usersContainer.items.create(user)

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}