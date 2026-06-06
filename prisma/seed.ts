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

const products = [
    // Ração Seca
    {
        name: 'Ração Golden Special Cães Adultos 15kg',
        price: 189.90,
        salePrice: 169.90,
        stock: 50,
        images: ['https://example.com/racao-golden.jpg'],
        subCategory: 'Ração Seca'
    },
    {
        name: 'Ração Premier Fórmula Cães Adultos 15kg',
        price: 249.90,
        salePrice: 229.90,
        stock: 40,
        images: ['https://example.com/premier.jpg'],
        subCategory: 'Ração Seca'
    },
    {
        name: 'Ração Royal Canin Mini Adult 10kg',
        price: 329.90,
        salePrice: 299.90,
        stock: 25,
        images: ['https://example.com/royal.jpg'],
        subCategory: 'Ração Seca'
    },

    // Ração Úmida
    {
        name: 'Sachê Pedigree Carne ao Molho 100g',
        price: 4.99,
        salePrice: 3.99,
        stock: 300,
        images: ['https://example.com/pedigree.jpg'],
        subCategory: 'Ração Úmida'
    },
    {
        name: 'Sachê Whiskas Peixe 85g',
        price: 3.99,
        salePrice: 3.49,
        stock: 250,
        images: ['https://example.com/whiskas.jpg'],
        subCategory: 'Ração Úmida'
    },

    // Petiscos
    {
        name: 'Bifinho Keldog Carne 500g',
        price: 24.90,
        salePrice: 19.90,
        stock: 100,
        images: ['https://example.com/bifinho.jpg'],
        subCategory: 'Petiscos'
    },
    {
        name: 'Petisco Dreamies Frango 40g',
        price: 8.90,
        salePrice: 6.90,
        stock: 150,
        images: ['https://example.com/dreamies.jpg'],
        subCategory: 'Petiscos'
    },

    // Suplementos
    {
        name: 'Omega 3 para Cães e Gatos 60 Cápsulas',
        price: 59.90,
        salePrice: 49.90,
        stock: 40,
        images: ['https://example.com/omega3.jpg'],
        subCategory: 'Suplementos'
    },

    // Shampoo
    {
        name: 'Shampoo Pet Neutro 500ml',
        price: 29.90,
        salePrice: 24.90,
        stock: 30,
        images: ['https://example.com/shampoo.jpg'],
        subCategory: 'Shampoo'
    },
    {
        name: 'Shampoo Antipulgas 500ml',
        price: 39.90,
        salePrice: 34.90,
        stock: 25,
        images: ['https://example.com/shampoo-antipulgas.jpg'],
        subCategory: 'Shampoo'
    },

    // Condicionador
    {
        name: 'Condicionador Hidratante Pet 500ml',
        price: 32.90,
        salePrice: 27.90,
        stock: 20,
        images: ['https://example.com/condicionador.jpg'],
        subCategory: 'Condicionador'
    },

    // Escova e Pente
    {
        name: 'Escova Removedora de Pelos',
        price: 49.90,
        salePrice: 39.90,
        stock: 35,
        images: ['https://example.com/escova.jpg'],
        subCategory: 'Escova e Pente'
    },

    // Perfume
    {
        name: 'Perfume Pet Lavanda 120ml',
        price: 19.90,
        salePrice: 15.90,
        stock: 45,
        images: ['https://example.com/perfume.jpg'],
        subCategory: 'Perfume Pet'
    },

    // Antiparasitários
    {
        name: 'Antipulgas Simparic 20mg',
        price: 69.90,
        salePrice: 64.90,
        stock: 60,
        images: ['https://example.com/simparic.jpg'],
        subCategory: 'Antiparasitários'
    },
    {
        name: 'Antipulgas NexGard 28mg',
        price: 79.90,
        salePrice: 74.90,
        stock: 50,
        images: ['https://example.com/nexgard.jpg'],
        subCategory: 'Antiparasitários'
    },

    // Vitaminas
    {
        name: 'Vitamina A-Z Pet 60 Comprimidos',
        price: 44.90,
        salePrice: 39.90,
        stock: 30,
        images: ['https://example.com/vitamina.jpg'],
        subCategory: 'Vitaminas'
    },

    // Coleiras
    {
        name: 'Coleira Ajustável para Cães',
        price: 39.90,
        salePrice: 34.90,
        stock: 20,
        images: ['https://example.com/coleira.jpg'],
        subCategory: 'Coleiras'
    },
    {
        name: 'Coleira de Couro Premium',
        price: 69.90,
        salePrice: 59.90,
        stock: 15,
        images: ['https://example.com/coleira-couro.jpg'],
        subCategory: 'Coleiras'
    },

    // Guias
    {
        name: 'Guia Retrátil 5m',
        price: 89.90,
        salePrice: 79.90,
        stock: 20,
        images: ['https://example.com/guia.jpg'],
        subCategory: 'Guias e Peitorais'
    },

    // Camas
    {
        name: 'Cama Pet Redonda Média',
        price: 129.90,
        salePrice: 109.90,
        stock: 15,
        images: ['https://example.com/cama.jpg'],
        subCategory: 'Camas e Casinhas'
    },
    {
        name: 'Casinha Plástica Grande',
        price: 249.90,
        salePrice: 219.90,
        stock: 10,
        images: ['https://example.com/casinha.jpg'],
        subCategory: 'Camas e Casinhas'
    },

    // Brinquedos Cães
    {
        name: 'Mordedor de Borracha Resistente',
        price: 24.90,
        salePrice: 19.90,
        stock: 80,
        images: ['https://example.com/mordedor.jpg'],
        subCategory: 'Brinquedos para Cães'
    },
    {
        name: 'Bola Interativa para Cães',
        price: 34.90,
        salePrice: 29.90,
        stock: 60,
        images: ['https://example.com/bola.jpg'],
        subCategory: 'Brinquedos para Cães'
    },

    // Brinquedos Gatos
    {
        name: 'Varinha com Pena para Gatos',
        price: 19.90,
        salePrice: 14.90,
        stock: 70,
        images: ['https://example.com/varinha.jpg'],
        subCategory: 'Brinquedos para Gatos'
    },
    {
        name: 'Ratinho de Pelúcia Catnip',
        price: 14.90,
        salePrice: 11.90,
        stock: 100,
        images: ['https://example.com/ratinho.jpg'],
        subCategory: 'Brinquedos para Gatos'
    },

    // Brinquedos Aves
    {
        name: 'Balanço Colorido para Calopsitas',
        price: 24.90,
        salePrice: 19.90,
        stock: 25,
        images: ['https://example.com/balanco.jpg'],
        subCategory: 'Brinquedos para Aves'
    }
];

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

    // Produtos
    for (const p of products) {
        const subCategory = await prisma.sub_category.findUnique({
            where: {
                name: p.subCategory
            }
        });

        if (!subCategory) continue;

        await prisma.product.upsert({
            where: {
                name: p.name
            },
            update: {
                price: p.price,
                salePrice: p.salePrice,
                stock: p.stock,
                images: p.images
            },
            create: {
                name: p.name,
                price: p.price,
                salePrice: p.salePrice,
                stock: p.stock,
                images: p.images,
                subCategories: {
                create: {
                    subCategoryId: subCategory.id
                }
                }
            }
        }); 
    }

    console.log('Seed concluído!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

//yarn prisma db seed
//yarn prisma studio