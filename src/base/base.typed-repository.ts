import { BaseRepository, PaginationMeta } from "../base/base.repository";
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

type WithInclude<TClient, TInc extends object> =
    NonNullable<Prisma.Result<TClient, { include: TInc }, 'findUnique'>>;

type WithSelect<TClient, TSel extends object> =
    NonNullable<Prisma.Result<TClient, { select: TSel }, 'findUnique'>>;

type ExtractModel<TClient extends PrismaDelegate> =
    NonNullable<Prisma.Result<TClient, {}, 'findFirst'>>;

type ExtractCreate<TClient extends PrismaDelegate> =
    Prisma.Args<TClient, 'create'> extends { data: infer D } ? D : never;

type ExtractUpdate<TClient extends PrismaDelegate> =
    Prisma.Args<TClient, 'update'> extends { data: infer D } ? D : never;

type ExtractWhere<TClient extends PrismaDelegate> =
    Prisma.Args<TClient, 'findFirst'> extends { where?: infer W } ? W & object : object;

type ExtractInclude<TClient extends PrismaDelegate> =
    Prisma.Args<TClient, 'findFirst'> extends { include?: infer I } ? I & object : object;

type ExtractSelect<TClient extends PrismaDelegate> =
    Prisma.Args<TClient, 'findFirst'> extends { select?: infer S } ? S & object : object;

type ExtractOrderBy<TClient extends PrismaDelegate> =
    Prisma.Args<TClient, 'findMany'> extends { orderBy?: infer O } ? O & object : object;

type Pagination = { page?: number; pageSize?: number };

export abstract class TypedRepository<TClient extends PrismaDelegate> extends BaseRepository<
    ExtractModel<TClient>,
    ExtractCreate<TClient>,
    ExtractUpdate<TClient>,
    ExtractWhere<TClient>,
    ExtractInclude<TClient>,
    ExtractSelect<TClient>,
    ExtractOrderBy<TClient>
> {
    protected abstract model: TClient;

    // findMany
    async findMany<TInc extends ExtractInclude<TClient>>(
        where: ExtractWhere<TClient>,
        options: { include: TInc; select?: never; orderBy?: ExtractOrderBy<TClient> | ExtractOrderBy<TClient>[]; pagination?: Pagination }
    ): Promise<{ data: WithInclude<TClient, TInc>[]; meta: PaginationMeta }>;

    async findMany<TSel extends ExtractSelect<TClient>>(
        where: ExtractWhere<TClient>,
        options: { select: TSel; include?: never; orderBy?: ExtractOrderBy<TClient> | ExtractOrderBy<TClient>[]; pagination?: Pagination }
    ): Promise<{ data: WithSelect<TClient, TSel>[]; meta: PaginationMeta }>;

    async findMany(
        where?: ExtractWhere<TClient>,
        options?: { orderBy?: ExtractOrderBy<TClient> | ExtractOrderBy<TClient>[]; pagination?: Pagination }
    ): Promise<{ data: ExtractModel<TClient>[]; meta: PaginationMeta }>;

    async findMany(where: any = {}, options: any = {}): Promise<any> {
        return super.findMany(where, options);
    }

    // findFirst
    async findFirst<TInc extends ExtractInclude<TClient>>(
        where: ExtractWhere<TClient>,
        options: { include: TInc; select?: never }
    ): Promise<WithInclude<TClient, TInc> | null>;

    async findFirst<TSel extends ExtractSelect<TClient>>(
        where: ExtractWhere<TClient>,
        options: { select: TSel; include?: never }
    ): Promise<WithSelect<TClient, TSel> | null>;

    async findFirst(
        where: ExtractWhere<TClient>,
        options?: { include?: never; select?: never }
    ): Promise<ExtractModel<TClient> | null>;

    async findFirst(where: any, options: any = {}): Promise<any> {
        return super.findFirst(where, options);
    }

    // findUnique
    async findUnique<TInc extends ExtractInclude<TClient>>(
        where: ExtractWhere<TClient>,
        options: { include: TInc; select?: never }
    ): Promise<WithInclude<TClient, TInc> | null>;

    async findUnique<TSel extends ExtractSelect<TClient>>(
        where: ExtractWhere<TClient>,
        options: { select: TSel; include?: never }
    ): Promise<WithSelect<TClient, TSel> | null>;

    async findUnique(
        where: ExtractWhere<TClient>,
        options?: { include?: never; select?: never }
    ): Promise<ExtractModel<TClient> | null>;

    async findUnique(where: any, options: any = {}): Promise<any> {
        return super.findUnique(where, options);
    }

    // create
    async create<TInc extends ExtractInclude<TClient>>(
        data: ExtractCreate<TClient>,
        options: { include: TInc; select?: never }
    ): Promise<WithInclude<TClient, TInc>>;

    async create<TSel extends ExtractSelect<TClient>>(
        data: ExtractCreate<TClient>,
        options: { select: TSel; include?: never }
    ): Promise<WithSelect<TClient, TSel>>;

    async create(
        data: ExtractCreate<TClient>,
        options?: { include?: never; select?: never }
    ): Promise<ExtractModel<TClient>>;

    async create(data: any, options: any = {}): Promise<any> {
        return super.create(data, options);
    }

    // update
    async update<TInc extends ExtractInclude<TClient>>(
        where: ExtractWhere<TClient>,
        data: ExtractUpdate<TClient>,
        options: { include: TInc; select?: never }
    ): Promise<WithInclude<TClient, TInc>>;

    async update<TSel extends ExtractSelect<TClient>>(
        where: ExtractWhere<TClient>,
        data: ExtractUpdate<TClient>,
        options: { select: TSel; include?: never }
    ): Promise<WithSelect<TClient, TSel>>;

    async update(
        where: ExtractWhere<TClient>,
        data: ExtractUpdate<TClient>,
        options?: { include?: never; select?: never }
    ): Promise<ExtractModel<TClient>>;

    async update(where: any, data: any, options: any = {}): Promise<any> {
        return super.update(where, data, options);
    }
}