import { NextRequest, NextResponse } from 'next/server'
import { usersContainer } from '@/lib/azure'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

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

    // Create user
    const user = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash the password
      createdAt: new Date().toISOString()
    }

    await usersContainer.items.create(user)

    return NextResponse.json({ message: 'User created successfully', userId: user.id }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}