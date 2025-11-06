import { NextRequest, NextResponse } from 'next/server'
import { usersContainer } from '@/lib/azure'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const { resources: users } = await usersContainer.items
      .query({
        query: 'SELECT * FROM c WHERE c.email = @email',
        parameters: [{ name: '@email', value: email }]
      })
      .fetchAll()

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users[0]

    // In production, compare hashed password
    if (user.password !== password) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Create session (simplified)
    const session = {
      userId: user.id,
      email: user.email,
      name: user.name
    }

    return NextResponse.json({ message: 'Login successful', session }, { status: 200 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}