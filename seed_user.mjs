import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@vault.io';
    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: { password: hashedPassword },
            create: {
                email,
                password: hashedPassword,
                name: 'Administrator'
            },
        });
        console.log('SEED_SUCCESS: ' + user.email);
    } catch (e) {
        console.error('SEED_FAILED:', e);
    }
}

main()
    .finally(async () => {
        await prisma.$disconnect();
    });
