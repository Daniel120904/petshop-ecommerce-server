import { CouponType, PrismaClient } from '@prisma/client';
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
    // ─── Ração Seca ───────────────────────────────────────────────────────────
    {
        name: 'Ração Golden Special Cães Adultos 15kg',
        description: 'Ração seca completa para cães adultos de todas as raças. Fórmula balanceada com proteínas de alta qualidade, vitaminas e minerais essenciais para manter a saúde, energia e pelagem brilhante do seu cão. Livre de corantes artificiais.',
        price: 189.90,
        salePrice: 169.90,
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
            'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
        ],
        subCategory: 'Ração Seca'
    },
    {
        name: 'Ração Premier Fórmula Cães Adultos 15kg',
        description: 'Ração super premium desenvolvida com ingredientes selecionados e tecnologia de ponta. Contém probióticos para saúde intestinal, ômega 3 e 6 para pelagem sedosa e antioxidantes para fortalecer o sistema imunológico. Indicada para cães adultos de médio e grande porte.',
        price: 249.90,
        salePrice: 229.90,
        stock: 40,
        images: [
            'https://images.unsplash.com/photo-1600369671236-e74521d31107?w=600&q=80',
            'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&q=80',
        ],
        subCategory: 'Ração Seca'
    },
    {
        name: 'Ração Royal Canin Mini Adult 10kg',
        description: 'Alimento completo e balanceado especialmente formulado para cães adultos de raças pequenas (até 10 kg) com mais de 10 meses. Croquetes de tamanho adaptado à mandíbula pequena, com aromas exclusivos que estimulam até o apetite mais exigente. Auxilia na manutenção do peso ideal com L-carnitina e suporta a saúde da pele e pelagem.',
        price: 329.90,
        salePrice: 299.90,
        stock: 25,
        images: [
            'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&q=80',
            'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
        ],
        subCategory: 'Ração Seca'
    },

    // ─── Ração Úmida ──────────────────────────────────────────────────────────
    {
        name: 'Sachê Pedigree Carne ao Molho 100g',
        description: 'Alimento úmido completo para cães adultos com suculenta carne bovina ao molho. Rico em proteínas e com textura irresistível, pode ser servido sozinho ou misturado à ração seca. Sem conservantes artificiais, com vitaminas e minerais para o bem-estar diário do seu cão.',
        price: 4.99,
        salePrice: 3.99,
        stock: 300,
        images: [
            'https://images.unsplash.com/photo-1585846416120-3a7354ed7d39?w=600&q=80',
        ],
        subCategory: 'Ração Úmida'
    },
    {
        name: 'Sachê Whiskas Peixe 85g',
        description: 'Alimento úmido completo para gatos adultos com delicioso peixe em molho. Formulado para atender 100% das necessidades nutricionais diárias, apoia a saúde urinária e fornece a hidratação extra que os gatos precisam. Aroma irresistível que agrada até os felinos mais seletivos.',
        price: 3.99,
        salePrice: 3.49,
        stock: 250,
        images: [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
        ],
        subCategory: 'Ração Úmida'
    },

    // ─── Petiscos ─────────────────────────────────────────────────────────────
    {
        name: 'Bifinho Keldog Carne 500g',
        description: 'Petisco macio e saboroso com sabor de carne bovina, ideal para recompensar e adestrar cães de qualquer raça e porte. Textura macia que facilita a mastigação, enriquecido com vitaminas para complementar a dieta do seu melhor amigo. Embalagem econômica com 500g.',
        price: 24.90,
        salePrice: 19.90,
        stock: 100,
        images: [
            'https://images.unsplash.com/photo-1601758174493-89b9bc3a9b27?w=600&q=80',
        ],
        subCategory: 'Petiscos'
    },
    {
        name: 'Petisco Dreamies Frango 40g',
        description: 'Petisco crocante por fora e cremoso por dentro com sabor de frango — o favorito dos gatos! Perfeito para mimar e reforçar laços com seu felino. Baixo teor calórico, podendo ser oferecido diariamente como parte de uma dieta equilibrada.',
        price: 8.90,
        salePrice: 6.90,
        stock: 150,
        images: [
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
        ],
        subCategory: 'Petiscos'
    },

    // ─── Suplementos ──────────────────────────────────────────────────────────
    {
        name: 'Omega 3 para Cães e Gatos 60 Cápsulas',
        description: 'Suplemento de ômega 3 de alta concentração (EPA + DHA) derivado de óleo de peixe de água fria. Promove pelagem brilhante, reduz processos inflamatórios, apoia a saúde cardiovascular e a função cognitiva de cães e gatos. Embalagem com 60 cápsulas gelatinosas de fácil administração.',
        price: 59.90,
        salePrice: 49.90,
        stock: 40,
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
        ],
        subCategory: 'Suplementos'
    },

    // ─── Shampoo ──────────────────────────────────────────────────────────────
    {
        name: 'Shampoo Pet Neutro 500ml',
        description: 'Shampoo de pH neutro especialmente formulado para a pele sensível de cães e gatos. Limpa profundamente sem ressecar, hidratar e suaviza a pelagem, deixando-a macia e com brilho natural. Fórmula hipoalergênica, livre de parabenos e corantes artificiais. Fragrância suave e agradável.',
        price: 29.90,
        salePrice: 24.90,
        stock: 30,
        images: [
            'https://images.unsplash.com/photo-1591316153282-6c38e6f05cc2?w=600&q=80',
        ],
        subCategory: 'Shampoo'
    },
    {
        name: 'Shampoo Antipulgas 500ml',
        description: 'Shampoo com ação inseticida e repelente contra pulgas, carrapatos e sarnas. Elimina os parasitas durante o banho com eficácia comprovada, além de limpar, perfumar e conferir brilho à pelagem. Compostos ativos de origem natural. Indicado para cães a partir de 3 meses de idade.',
        price: 39.90,
        salePrice: 34.90,
        stock: 25,
        images: [
            'https://images.unsplash.com/photo-1591316153282-6c38e6f05cc2?w=600&q=80',
        ],
        subCategory: 'Shampoo'
    },

    // ─── Condicionador ────────────────────────────────────────────────────────
    {
        name: 'Condicionador Hidratante Pet 500ml',
        description: 'Condicionador de uso profissional para cães e gatos com pelagem longa ou propensa a embaraçar. Rico em proteínas da seda e extrato de aloe vera, proporciona hidratação profunda, facilita o desembaraço e reduz o volume, deixando o pelo sedoso e com brilho intenso.',
        price: 32.90,
        salePrice: 27.90,
        stock: 20,
        images: [
            'https://images.unsplash.com/photo-1591316153282-6c38e6f05cc2?w=600&q=80',
        ],
        subCategory: 'Condicionador'
    },

    // ─── Escova e Pente ───────────────────────────────────────────────────────
    {
        name: 'Escova Removedora de Pelos',
        description: 'Escova ergonômica com cerdas de aço inoxidável especialmente projetadas para remover pelos soltos, nós e impurezas da pelagem de cães e gatos. O cabo antiderrapante garante conforto e controle durante a escovação. Estimula a circulação sanguínea da pele e distribui os óleos naturais do pelo.',
        price: 49.90,
        salePrice: 39.90,
        stock: 35,
        images: [
            'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80',
        ],
        subCategory: 'Escova e Pente'
    },

    // ─── Perfume Pet ──────────────────────────────────────────────────────────
    {
        name: 'Perfume Pet Lavanda 120ml',
        description: 'Colônia com suave fragrância de lavanda, desenvolvida especialmente para cães e gatos. Fórmula aquosa de longa duração que neutraliza odores e deixa o pet cheiroso entre os banhos. Não contém álcool, sendo seguro para uso frequente. Basta borrifar suavemente sobre a pelagem.',
        price: 19.90,
        salePrice: 15.90,
        stock: 45,
        images: [
            'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
        ],
        subCategory: 'Perfume Pet'
    },

    // ─── Antiparasitários ─────────────────────────────────────────────────────
    {
        name: 'Antipulgas Simparic 20mg',
        description: 'Comprimido mastigável com sabor agradável para prevenção e tratamento de infestações por pulgas e carrapatos em cães de 2,6 a 5 kg. Ação rápida: começa a eliminar pulgas em 3 horas e carrapatos em 8 horas. Proteção contínua por 35 dias. Administração mensal e conveniente.',
        price: 69.90,
        salePrice: 64.90,
        stock: 60,
        images: [
            'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80',
        ],
        subCategory: 'Antiparasitários'
    },
    {
        name: 'Antipulgas NexGard 28mg',
        description: 'Comprimido mastigável com sabor de carne para cães de 4 a 10 kg. Elimina pulgas antes que possam botar ovos e combate carrapatos das principais espécies. Proteção completa de 30 dias com dose única mensal. O princípio ativo afoxolaner age no sistema nervoso dos parasitas, sem risco para o cão.',
        price: 79.90,
        salePrice: 74.90,
        stock: 50,
        images: [
            'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&q=80',
        ],
        subCategory: 'Antiparasitários'
    },

    // ─── Vitaminas ────────────────────────────────────────────────────────────
    {
        name: 'Vitamina A-Z Pet 60 Comprimidos',
        description: 'Suplemento multivitamínico e mineral completo para cães e gatos adultos. Contém vitaminas A, C, D, E, complexo B, zinco, biotina e selênio para suprir eventuais carências nutricionais, fortalecer o sistema imunológico, melhorar a saúde da pele e pelagem. Comprimidos palatáveis com sabor de carne.',
        price: 44.90,
        salePrice: 39.90,
        stock: 30,
        images: [
            'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
        ],
        subCategory: 'Vitaminas'
    },

    // ─── Coleiras ─────────────────────────────────────────────────────────────
    {
        name: 'Coleira Ajustável para Cães',
        description: 'Coleira de nylon resistente com fivela de alumínio de alta durabilidade. Tamanho ajustável para garantir conforto e segurança ao pescoço do cão. Anel em D robusto para fixação da guia e plaquinha de identificação. Disponível em diversas cores vibrantes. Indicada para uso diário em cães de pequeno a médio porte.',
        price: 39.90,
        salePrice: 34.90,
        stock: 20,
        images: [
            'https://images.unsplash.com/photo-1601758066301-4d0b4b8b3a2c?w=600&q=80',
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
        ],
        subCategory: 'Coleiras'
    },
    {
        name: 'Coleira de Couro Premium',
        description: 'Coleira artesanal confeccionada em couro legítimo curtido, com costuras reforçadas e ferragens em latão envelhecido. Design elegante e atemporal que combina durabilidade com estilo. Forrada internamente para não agredir a pele do cão. Ideal para cães de médio e grande porte que merecem o melhor.',
        price: 69.90,
        salePrice: 59.90,
        stock: 15,
        images: [
            'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
        ],
        subCategory: 'Coleiras'
    },

    // ─── Guias e Peitorais ────────────────────────────────────────────────────
    {
        name: 'Guia Retrátil 5m',
        description: 'Guia retrátil com cabo de nylon embutido que se estende até 5 metros, dando liberdade controlada ao cão durante os passeios. Mecanismo de trava instantânea e botão de freio ergonômico para controle fácil e seguro. Cabo resistente suporta até 25 kg. Indicada para cães de pequeno a médio porte.',
        price: 89.90,
        salePrice: 79.90,
        stock: 20,
        images: [
            'https://images.unsplash.com/photo-1601758066301-4d0b4b8b3a2c?w=600&q=80',
        ],
        subCategory: 'Guias e Peitorais'
    },

    // ─── Camas e Casinhas ─────────────────────────────────────────────────────
    {
        name: 'Cama Pet Redonda Média',
        description: 'Cama redonda com bordas elevadas que proporcionam sensação de aconchego e segurança para cães e gatos. Preenchimento em espuma de alta densidade para suporte ortopédico e conforto máximo. Capa removível e lavável em máquina. Tecido macio e antialérgico. Tamanho médio, ideal para pets de até 10 kg.',
        price: 129.90,
        salePrice: 109.90,
        stock: 15,
        images: [
            'https://images.unsplash.com/photo-1601758174493-89b9bc3a9b27?w=600&q=80',
            'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=600&q=80',
        ],
        subCategory: 'Camas e Casinhas'
    },
    {
        name: 'Casinha Plástica Grande',
        description: 'Casinha em plástico resistente de alta densidade com ventilação lateral e telhado removível para fácil limpeza. Design anatômico com entrada frontal ampla e piso elevado para proteção contra umidade. Resistente a raios UV e intempéries, ideal para uso externo ou interno. Para cães de grande porte de até 40 kg.',
        price: 249.90,
        salePrice: 219.90,
        stock: 10,
        images: [
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
        ],
        subCategory: 'Camas e Casinhas'
    },

    // ─── Brinquedos para Cães ─────────────────────────────────────────────────
    {
        name: 'Mordedor de Borracha Resistente',
        description: 'Mordedor fabricado em borracha natural 100% atóxica e ultrarresistente, desenvolvido para cães que adoram mastigar. Ajuda na higiene dental ao reduzir o acúmulo de tártaro durante a mordida. Textura irregular estimula as gengivas e entretém o pet por horas. Disponível em tamanhos P, M e G.',
        price: 24.90,
        salePrice: 19.90,
        stock: 80,
        images: [
            'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
        ],
        subCategory: 'Brinquedos para Cães'
    },
    {
        name: 'Bola Interativa para Cães',
        description: 'Bola interativa com compartimento interno para inserir petiscos ou ração, estimulando o instinto natural de forrageamento do cão. Fabricada em borracha resistente e atóxica, suporta mordidas intensas. Promove atividade física e enriquecimento ambiental, combatendo o tédio e comportamentos destrutivos.',
        price: 34.90,
        salePrice: 29.90,
        stock: 60,
        images: [
            'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=600&q=80',
            'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600&q=80',
        ],
        subCategory: 'Brinquedos para Cães'
    },

    // ─── Brinquedos para Gatos ────────────────────────────────────────────────
    {
        name: 'Varinha com Pena para Gatos',
        description: 'Varinha interativa com penas coloridas na ponta que simula o movimento de um pássaro, despertando o instinto caçador dos gatos. Haste flexível de fibra de carbono que imita movimentos imprevisíveis. Ideal para sessões de brincadeira diária que estimulam o exercício físico e o vínculo entre tutor e pet.',
        price: 19.90,
        salePrice: 14.90,
        stock: 70,
        images: [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
        ],
        subCategory: 'Brinquedos para Gatos'
    },
    {
        name: 'Ratinho de Pelúcia Catnip',
        description: 'Brinquedo em pelúcia no formato de ratinho recheado com catnip (erva-do-gato) 100% natural certificada. O aroma do catnip estimula e euforia natural nos gatos, promovendo brincadeiras ativas e reduzindo o estresse. Tamanho ideal para ser carregado, jogado e abraçado pelo seu felino.',
        price: 14.90,
        salePrice: 11.90,
        stock: 100,
        images: [
            'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
        ],
        subCategory: 'Brinquedos para Gatos'
    },

    // ─── Brinquedos para Aves ─────────────────────────────────────────────────
    {
        name: 'Balanço Colorido para Calopsitas',
        description: 'Balanço em madeira natural não tóxica com cordas de algodão e contas coloridas de plástico atóxico. Estimula o equilíbrio, a coordenação motora e o entretenimento de calopsitas, periquitos e outros pássaros de pequeno porte. Gancho de metal inoxidável para fixação fácil na grade da gaiola.',
        price: 24.90,
        salePrice: 19.90,
        stock: 25,
        images: [
            'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80',
        ],
        subCategory: 'Brinquedos para Aves'
    }
];

async function main() {
    await createApiUser();

    // Roles
    for (const role of Object.values(RoleName) as string[]) {
        await prisma.role.upsert({
            where: { name: role },
            update: {},
            create: { name: role },
        });
    }

    // Genders
    for (const name of Object.values(GenderName) as string[]) {
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
                description: p.description,
                price: p.price,
                salePrice: p.salePrice,
                stock: p.stock,
                images: p.images
            },
            create: {
                name: p.name,
                description: p.description,
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

    // Cidade para os endereços
    const sp = await prisma.state.findUnique({
        where: { abbreviation: 'SP' }
    });

    if (!sp) throw new Error('Estado SP não encontrado');

    const city = await prisma.city.upsert({
        where: {
            name_stateId: {
                name: 'Mogi das Cruzes',
                stateId: sp.id
            }
        },
        update: {},
        create: {
            name: 'Mogi das Cruzes',
            stateId: sp.id
        }
    });

    const customerRole = await prisma.role.findUnique({
        where: { name: RoleName.USER }
    });

    const gender = await prisma.gender.findFirst();

    if (!customerRole || !gender) {
        throw new Error('Role ou gênero não encontrado');
    }

    const defaultPassword = await bcrypt.hash('123@Pass', 10);

    // =====================
    // USUÁRIO 1
    // =====================
    const joaoAuth = await prisma.authentication.upsert({
        where: { email: 'joao@gmail.com' },
        update: {},
        create: {
            email: 'joao@gmail.com',
            password: defaultPassword,
            user: {
                create: {
                    name: 'João Silva',
                    birthday: new Date('1995-05-10'),
                    cpf: '11111111111',
                    genderId: gender.id,
                    roleId: customerRole.id,

                    phones: {
                        create: {
                            ddd: '11',
                            number: '999999991',
                            type: 'cellphone'
                        }
                    },

                    addresses: {
                        create: {
                            nickname: 'Casa',
                            street: 'Rua das Flores',
                            number: '123',
                            neighborhood: 'Centro',
                            zip: '02011000',
                            cityId: city.id
                        }
                    }
                }
            }
        },
        include: {
            user: {
                include: {
                    addresses: true
                }
            }
        }
    });

    // =====================
    // USUÁRIO 2
    // =====================
    const mariaAuth = await prisma.authentication.upsert({
        where: { email: 'maria@gmail.com' },
        update: {},
        create: {
            email: 'maria@gmail.com',
            password: defaultPassword,
            user: {
                create: {
                    name: 'Maria Oliveira',
                    birthday: new Date('1998-02-15'),
                    cpf: '22222222222',
                    genderId: gender.id,
                    roleId: customerRole.id,

                    phones: {
                        create: {
                            ddd: '11',
                            number: '999999992',
                            type: 'cellphone'
                        }
                    },

                    addresses: {
                        create: {
                            nickname: 'Casa',
                            street: 'Av. Japão',
                            number: '456',
                            neighborhood: 'Centro',
                            zip: '01310100',
                            cityId: city.id
                        }
                    }
                }
            }
        },
        include: {
            user: {
                include: {
                    addresses: true
                }
            }
        }
    });

    // =====================
    // USUÁRIO 3
    // =====================
    const pedroAuth = await prisma.authentication.upsert({
        where: { email: 'pedro@gmail.com' },
        update: {},
        create: {
            email: 'pedro@gmail.com',
            password: defaultPassword,
            user: {
                create: {
                    name: 'Pedro Santos',
                    birthday: new Date('1992-11-20'),
                    cpf: '33333333333',
                    genderId: gender.id,
                    roleId: customerRole.id,

                    phones: {
                        create: {
                            ddd: '11',
                            number: '999999993',
                            type: 'cellphone'
                        }
                    },

                    addresses: {
                        create: {
                            nickname: 'Casa',
                            street: 'Rua Ipiranga',
                            number: '789',
                            neighborhood: 'Vila Oliveira',
                            zip: '01001000',
                            cityId: city.id
                        }
                    }
                }
            }
        },
        include: {
            user: {
                include: {
                    addresses: true
                }
            }
        }
    });

    // =====================
    // CUPONS
    // =====================
    const coupons = [
        { code: 'BEMVINDO10', type: CouponType.percent, discount: 10, maxUses: 100 },
        { code: 'FRETE15', type: CouponType.value, discount: 15, maxUses: 50 },
        { code: 'PET20OFF', type: CouponType.percent, discount: 20, maxUses: 30 },
        { code: 'DESCONTO50', type: CouponType.value, discount: 50, maxUses: 10 },
    ];

    for (const coupon of coupons) {
        await prisma.coupon.upsert({
            where: { code: coupon.code },
            update: {},
            create: coupon,
        });
    }

    // =====================
    // CARTÕES DOS USUÁRIOS
    // =====================
    const joaoUser = joaoAuth.user;
    const mariaUser = mariaAuth.user;

    await prisma.card.upsert({
        where: { token: 'tok_joao_visa_4242' },
        update: {},
        create: {
            nickname: 'Visa pessoal',
            holder: 'JOAO SILVA',
            brand: 'visa',
            last4: '4242',
            token: 'tok_joao_visa_4242',
            primary: true,
            userId: joaoUser.id,
        },
    });

    await prisma.card.upsert({
        where: { token: 'tok_joao_master_1234' },
        update: {},
        create: {
            nickname: 'Master débito',
            holder: 'JOAO SILVA',
            brand: 'mastercard',
            last4: '1234',
            token: 'tok_joao_master_1234',
            primary: false,
            userId: joaoUser.id,
        },
    });

    await prisma.card.upsert({
        where: { token: 'tok_maria_elo_5678' },
        update: {},
        create: {
            nickname: 'Elo principal',
            holder: 'MARIA OLIVEIRA',
            brand: 'elo',
            last4: '5678',
            token: 'tok_maria_elo_5678',
            primary: true,
            userId: mariaUser.id,
        },
    });

    // Produtos para as compras
    const racao = await prisma.product.findFirst({
        where: {
            name: {
                contains: 'Golden'
            }
        }
    });

    const brinquedo = await prisma.product.findFirst({
        where: {
            name: {
                contains: 'Bola'
            }
        }
    });

    if (racao && brinquedo) {

        // Compra do João
        await prisma.sale.create({
            data: {
                userId: joaoAuth.user.id,
                addressId: joaoAuth.user.addresses[0].id,

                totalPrice: 199.80,
                finalPrice: 179.80,
                freight: 15,
                status: 'delivered',

                items: {
                    create: [
                        {
                            productId: racao.id,
                            quantity: 1,
                            price: racao.salePrice
                        },
                        {
                            productId: brinquedo.id,
                            quantity: 1,
                            price: brinquedo.salePrice
                        }
                    ]
                },

                payment: {
                    create: {
                        type: 'pix',
                        status: 'paid',
                        amount: 179.80
                    }
                }
            }
        });

        // Compra da Maria
        await prisma.sale.create({
            data: {
                userId: mariaAuth.user.id,
                addressId: mariaAuth.user.addresses[0].id,

                totalPrice: racao.salePrice,
                finalPrice: racao.salePrice,
                freight: 12,
                status: 'shipped',

                items: {
                    create: [{
                        productId: racao.id,
                        quantity: 1,
                        price: racao.salePrice
                    }]
                },

                payment: {
                    create: {
                        type: 'card',
                        status: 'paid',
                        amount: racao.salePrice
                    }
                }
            }
        });

        // Compra do Pedro

        const ontem = new Date();
        ontem.setDate(ontem.getDate() - 1);

        await prisma.sale.create({
            data: {
                createdAt: ontem,
                userId: pedroAuth.user.id,
                addressId: pedroAuth.user.addresses[0].id,

                totalPrice: brinquedo.salePrice,
                finalPrice: brinquedo.salePrice,
                freight: 15,
                status: 'processing',

                items: {
                    create: [{
                        productId: brinquedo.id,
                        quantity: 2,
                        price: brinquedo.salePrice
                    }]
                },

                payment: {
                    create: {
                        type: 'pix',
                        status: 'pending',
                        amount: brinquedo.salePrice * 2
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