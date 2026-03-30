import { BaseRepository } from "../base/base.repository";
import { Prisma } from "../generated/prisma";

type PrismaDelegate = {
    findFirst: (...args: any) => any;
    findMany: (...args: any) => any;
    findUnique: (...args: any) => any;
    create: (...args: any) => any;
    update: (...args: any) => any;
    delete: (...args: any) => any;
    deleteMany: (...args: any) => any;
};

// Tipo genérico de where gerado a partir do TModel
type WhereInput<TModel> = {
    [K in keyof TModel]?: TModel[K] | {
        equals?: TModel[K];
        in?: TModel[K][];
        not?: TModel[K];
        lt?: TModel[K];
        lte?: TModel[K];
        gt?: TModel[K];
        gte?: TModel[K];
        contains?: string;
        startsWith?: string;
        endsWith?: string;
    };
} & { AND?: WhereInput<TModel>[]; OR?: WhereInput<TModel>[]; NOT?: WhereInput<TModel> };

// Extrai automaticamente os tipos do delegate do Prisma (ex: prisma.user)
type ExtractModelTypes<TClient extends PrismaDelegate> = {
    Model: Prisma.Result<TClient, {}, 'findFirst'>;

    Create: Prisma.Args<TClient, 'create'> extends { data: infer D }
        ? D
        : never;

    Update: Prisma.Args<TClient, 'update'> extends { data: infer D }
        ? D
        : never;

    Where: Prisma.Args<TClient, 'findFirst'> extends { where?: infer W }
        ? W
        : never;

    Include: Prisma.Args<TClient, 'findFirst'> extends { include?: infer I }
        ? I
        : never;

    Select: Prisma.Args<TClient, 'findFirst'> extends { select?: infer S }
        ? S
        : never;

    OrderBy: Prisma.Args<TClient, 'findMany'> extends { orderBy?: infer O }
        ? O
        : never;
};

/**
 * Usa findFirstOrThrow pois seus overloads são mais simples que findFirst,
 * permitindo que o TS resolva o payload com include/select corretamente.
 * Fallback para findFirst caso o delegate não tenha findFirstOrThrow.
 */
type PrismaPayload<
    TClient,
    TArgs,
    TMethod extends 'findUnique' | 'findFirst'
> = Prisma.Result<TClient, TArgs, TMethod>;

type WithInclude<TClient, TInc extends object> =
    NonNullable<PrismaPayload<TClient, { include: TInc }, 'findUnique'>>;

type WithSelect<TClient, TSel extends object> =
    NonNullable<PrismaPayload<TClient, { select: TSel }, 'findUnique'>>;

/**
 * Fábrica que cria uma classe base tipada para um delegate do Prisma.
 *
 * Uso:
 *   const AuthBase = createRepository(prisma.authentication);
 *   class AuthRepository extends AuthBase {}
 *   export default new AuthRepository();
 */
export function createRepository<TClient extends PrismaDelegate>(model: TClient) {
    // Resolve todos os tipos uma vez a partir do delegate
    type Types   = ExtractModelTypes<TClient>;
    type TModel  = NonNullable<Types['Model']>;
    type TCreate = Types['Create'];
    type TUpdate = Types['Update'];
    type TWhere   = Types['Where']   extends object ? Types['Where']   : object;
    type TInclude = Types['Include'] extends object ? Types['Include'] : object;
    type TSelect  = Types['Select']  extends object ? Types['Select']  : object;
    type TOrderBy = Types['OrderBy'] extends object ? Types['OrderBy'] : object;

    // Classe concreta (não abstrata) — pode ser instanciada ou estendida diretamente
    abstract class Repository extends BaseRepository<
        TModel,
        TCreate,
        TUpdate,
        TWhere,
        TInclude,
        TSelect,
        TOrderBy
    > {
        // Injeta o delegate do Prisma no campo esperado pelo BaseRepository
        protected model = model;

        // --- Overloads de create ---
        // Sem options → retorna TModel completo
        async create(data: TCreate, options?: { include?: never; select?: never }): Promise<TModel>;
        // Com include → retorna TModel + campos do include
        async create<TInc extends TInclude>(data: TCreate, options: { include: TInc; select?: never }): Promise<WithInclude<TClient, TInc>>;
        // Com select → retorna subconjunto parcial
        async create<TSel extends TSelect>(data: TCreate, options: { select: TSel; include?: never }): Promise<WithSelect<TClient, TSel>>;
        async create(input: TCreate, options: any = {}): Promise<any> {
            return super.create(input, options);
        }

        // --- Overloads de update ---
        async update(where: TWhere, data: TUpdate, options?: { include?: never; select?: never }): Promise<TModel>;
        async update<TInc extends TInclude>(where: TWhere, data: TUpdate, options: { include: TInc; select?: never }): Promise<WithInclude<TClient, TInc>>;
        async update<TSel extends TSelect>(where: TWhere, data: TUpdate, options: { select: TSel; include?: never }): Promise<WithSelect<TClient, TSel>>;
        async update(where: TWhere, data: TUpdate, options: any = {}): Promise<any> {
            return super.update(where, data, options);
        }

        // --- Overloads de findUnique ---
        async findUnique<TInc extends TInclude>(where: TWhere, options: { include: TInc; select?: never }): Promise<WithInclude<TClient, TInc> | null>;
        async findUnique<TSel extends TSelect>(where: TWhere, options: { select: TSel; include?: never }): Promise<WithSelect<TClient, TSel> | null>;
        async findUnique(where: TWhere, options?: { include?: never; select?: never }): Promise<TModel | null>;
        async findUnique(where: TWhere, options: any = {}): Promise<any> {
            return super.findUnique(where, options);
        }

        // --- Overloads de findFirst ---
        async findFirst<TInc extends TInclude>(where: TWhere, options: { include: TInc; select?: never }): Promise<WithInclude<TClient, TInc> | null>;
        async findFirst<TSel extends TSelect>(where: TWhere, options: { select: TSel; include?: never }): Promise<WithSelect<TClient, TSel> | null>;
        async findFirst(where: TWhere, options?: { include?: never; select?: never }): Promise<TModel | null>;
        async findFirst(where: TWhere, options: any = {}): Promise<any> {
            return super.findFirst(where, options);
        }
    }

    return Repository;
}
