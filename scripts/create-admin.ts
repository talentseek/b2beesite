import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createAdmin(email: string, firstName?: string, lastName?: string) {
  try {
    console.log(`Creating admin user: ${email}`)
    
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'ADMIN'
      },
      create: {
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        role: 'ADMIN'
      }
    })

    console.log(`✅ Admin user created/updated:`, {
      id: user.id,
      email: user.email,
      role: user.role
    })

    return user
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }
}

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.error('❌ Please provide an email address')
    console.log('Usage: npm run create-admin <email>')
    process.exit(1)
  }

  try {
    await createAdmin(email)
    console.log('🎉 Admin user setup complete!')
  } catch (error) {
    console.error('Failed to create admin user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
