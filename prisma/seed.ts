import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin1234', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        role: 'admin',
        passwordHash
      }
    });
  }

  const sampleMessages = [
    {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      message: 'Hello! We are interested in your services for a new product launch.',
      ipAddress: '203.0.113.42',
      status: 'new'
    },
    {
      name: 'Daniel Lee',
      email: 'daniel.lee@example.com',
      message: 'Can you share pricing details for the marketing package?',
      ipAddress: '198.51.100.23',
      status: 'reviewed'
    },
    {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      message: 'We love the demo. Please schedule a follow-up call.',
      ipAddress: '192.0.2.88',
      status: 'new'
    }
  ];

  for (const entry of sampleMessages) {
    await prisma.contactMessage.create({ data: entry });
  }
}

main()
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error during seed');
    }
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
