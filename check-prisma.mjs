import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    console.log('Fields in FileObjectWhereInput:', Object.keys(prisma.fileObject.fields ?? {}));
    // Alternatively check client dmmf
    const dmmf = (prisma as any)._dmmf;
    const model = dmmf?.datamodel?.models?.find((m: any) => m.name === 'FileObject');
    console.log('Model fields:', model?.fields?.map((f: any) => f.name));
    process.exit(0);
}

main();
