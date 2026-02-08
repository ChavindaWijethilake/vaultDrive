import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'test_manual@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        console.log('REGISTRATION_SUCCESS: ' + user.email);

        const verify = await prisma.user.findUnique({ where: { email } });
        console.log('VERIFICATION: ' + (verify ? 'FOUND' : 'NOT_FOUND'));

        // Cleanup
        await prisma.user.delete({ where: { email } });
        console.log('CLEANUP_SUCCESS');
    } catch (e) {
        console.error('REGISTRATION_FAILED:', e);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
