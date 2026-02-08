import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, id: true }
    });

    if (users.length > 0) {
        console.log('USERS_IN_DB:');
        users.forEach(u => console.log(`- ${u.email} (${u.id})`));
    } else {
        console.log('NO_USERS_FOUND');
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
