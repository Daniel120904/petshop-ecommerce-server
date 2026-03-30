import { PrismaClient } from '../src/generated/prisma';
import { RoleName } from '../src/utils/constants/role.constants';
import { GenderName } from '../src/utils/constants/gender.constants';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

async function main() {
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

    // Master
    const hashedPassword = await bcrypt.hash("123@Pass", 10);

    await prisma.authentication.create({
        data: {
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