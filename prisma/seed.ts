import { PrismaClient } from '../src/generated/prisma';
import { RoleName } from '../src/utils/constants/role.constants';
import { GenderName } from '../src/utils/constants/gender.constants';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createApiUser() {
    await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM pg_catalog.pg_roles
                WHERE rolname = 'api_user'
            ) THEN
                CREATE ROLE api_user LOGIN PASSWORD 'senha_forte';
            END IF;
        END
        $$;
    `);

    await prisma.$executeRawUnsafe(`
        GRANT CONNECT ON DATABASE "pet-shop" TO api_user;
    `);

    await prisma.$executeRawUnsafe(`
        GRANT USAGE ON SCHEMA public TO api_user;
    `);

    await prisma.$executeRawUnsafe(`
        GRANT SELECT, INSERT, UPDATE, DELETE
        ON ALL TABLES IN SCHEMA public
        TO api_user;
    `);

    await prisma.$executeRawUnsafe(`
        GRANT USAGE, SELECT
        ON ALL SEQUENCES IN SCHEMA public
        TO api_user;
    `);

    await prisma.$executeRawUnsafe(`
        ALTER DEFAULT PRIVILEGES IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE
        ON TABLES TO api_user;
    `);

    await prisma.$executeRawUnsafe(`
        ALTER DEFAULT PRIVILEGES IN SCHEMA public
        GRANT USAGE, SELECT
        ON SEQUENCES TO api_user;
    `);

    console.log('api_user criado/configurado!');
}

const states = [
    { name: 'Acre', abbreviation: 'AC' },
    { name: 'Alagoas', abbreviation: 'AL' },
    { name: 'Amapá', abbreviation: 'AP' },
    { name: 'Amazonas', abbreviation: 'AM' },
    { name: 'Bahia', abbreviation: 'BA' },
    { name: 'Ceará', abbreviation: 'CE' },
    { name: 'Distrito Federal', abbreviation: 'DF' },
    { name: 'Espírito Santo', abbreviation: 'ES' },
    { name: 'Goiás', abbreviation: 'GO' },
    { name: 'Maranhão', abbreviation: 'MA' },
    { name: 'Mato Grosso', abbreviation: 'MT' },
    { name: 'Mato Grosso do Sul', abbreviation: 'MS' },
    { name: 'Minas Gerais', abbreviation: 'MG' },
    { name: 'Pará', abbreviation: 'PA' },
    { name: 'Paraíba', abbreviation: 'PB' },
    { name: 'Paraná', abbreviation: 'PR' },
    { name: 'Pernambuco', abbreviation: 'PE' },
    { name: 'Piauí', abbreviation: 'PI' },
    { name: 'Rio de Janeiro', abbreviation: 'RJ' },
    { name: 'Rio Grande do Norte', abbreviation: 'RN' },
    { name: 'Rio Grande do Sul', abbreviation: 'RS' },
    { name: 'Rondônia', abbreviation: 'RO' },
    { name: 'Roraima', abbreviation: 'RR' },
    { name: 'Santa Catarina', abbreviation: 'SC' },
    { name: 'São Paulo', abbreviation: 'SP' },
    { name: 'Sergipe', abbreviation: 'SE' },
    { name: 'Tocantins', abbreviation: 'TO' },
];

const petCategories = [
    {
        name: 'Alimentação',
        subCategories: ['Ração Seca', 'Ração Úmida', 'Petiscos', 'Suplementos']
    },
    {
        name: 'Higiene e Beleza',
        subCategories: ['Shampoo', 'Condicionador', 'Escova e Pente', 'Perfume Pet']
    },
    {
        name: 'Saúde',
        subCategories: ['Antiparasitários', 'Vitaminas', 'Primeiros Socorros']
    },
    {
        name: 'Acessórios',
        subCategories: ['Coleiras', 'Guias e Peitorais', 'Roupas e Fantasias', 'Camas e Casinhas']
    },
    {
        name: 'Brinquedos',
        subCategories: ['Brinquedos para Cães', 'Brinquedos para Gatos', 'Brinquedos para Aves']
    },
]

async function main() {
    await createApiUser();
    
    // Roles
    for (const role of Object.values(RoleName)) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role },
        });
    }

    // Genders
    for (const name of Object.values(GenderName)) {
        await prisma.gender.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    // States
    for (const state of states) {
        await prisma.state.upsert({
            where: { abbreviation: state.abbreviation },
            update: {},
            create: state,
        });
    }

    // Categories e SubCategories
    for (const cat of petCategories) {
        await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: {
                name: cat.name,
                subCategories: {
                    create: cat.subCategories.map((name) => ({ name }))
                }
            }
        });
    }

    // Master
    const hashedPassword = await bcrypt.hash("123@Pass", 10);

    await prisma.authentication.upsert({
        where: { email: "master@gmail.com" },
        update: {},
        create: {
            email: "master@gmail.com",
            password: hashedPassword,
            user: {
                create: {
                    name: "Usuario Teste",
                    birthday: new Date("2000-01-01"),
                    cpf: "12345678901",
                    gender: {
                        connectOrCreate: {
                            where: { id: 1 },
                            create: { name: "Outro" },
                        },
                    },
                    role: {
                        connect: { name: RoleName.MASTER },
                    },
                },
            },
        },
    });

    console.log('Seed concluído!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

//yarn prisma db seed
//yarn prisma studio