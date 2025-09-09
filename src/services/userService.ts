import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";
import { CreateCartaoDto, CreateEnderecoDto, CreateTelefoneDto, CreateUserDto, GetUsersFiltresDto, UpdateCartaoPreferencial, UpdateEndereco, UpdateSenha, UpdateStatusUser, UpdateTelefoneDto, UpdateUserDto } from "../dtos/userDTO";

const prisma = new PrismaClient();

export class UserService {

  async createUser(data: CreateUserDto) {
    return prisma.user.create({
      data: {
        nome: data.nome,
        genero: data.genero,
        dataNascimento: new Date(data.dataNascimento),
        cpf: data.cpf,
        email: data.email,
        senha: data.senha,
      },
    });
  }

  async createTelefone(data: CreateTelefoneDto) {
    return prisma.telefone.create({
      data: {
        tipo: data.tipo,
        ddd: data.ddd,
        numero: data.numero,
        user: {
          connect: { id: data.userId },
        },
      },
    });
  }

  async createEndereco(data: CreateEnderecoDto) {
    return prisma.endereco.create({
      data: {
        nome: data.nome,
        tipoEndereco: data.tipoEndereco,
        tipoResidencia: data.tipoResidencia,
        tipoLogradouro: data.tipoLogradouro,
        logradouro: data.logradouro,
        numero: data.numero,
        bairro: data.bairro,
        cep: data.cep,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais,
        observacoes: data.observacoes,
        user: {
          connect: { id: data.userId },
        },
      }
    })
  }

  async createCartao(data: CreateCartaoDto) {
    return prisma.cartao.create({
      data: {
        nome: data.nome,
        numero: data.numero,
        bandeira: data.bandeira,
        cvv: data.cvv,
        user: {
          connect: { id: data.userId }
        }
      }
    })
  }

  async getUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        status: true,
      }
    })
  }

  async updateUser(data: UpdateUserDto) {
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        nome: data.nome,
        genero: data.genero,
        dataNascimento: new Date(data.dataNascimento),
        cpf: data.cpf,
        email: data.email,
      },
    });
  }

  async updateTelefone(data: UpdateTelefoneDto) {
    return prisma.telefone.update({
      where: { id: data.telefoneId },
      data: {
        tipo: data.tipo,
        ddd: data.ddd,
        numero: data.numero,
      }
    })
  }

  async updateSenha(data: UpdateSenha) {

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (data.senhaAtual !== user.senha) {
      throw new Error("Senha atual incorreta");
    }

    return prisma.user.update({
      where: { id: data.userId },
      data: {
        senha: data.novaSenha
      }
    })
  }

  async updateEndereco(data: UpdateEndereco) {
    return prisma.endereco.update({
      where: { id: data.enderecoId },
      data: {
        nome: data.nome,
        tipoEndereco: data.tipoEndereco,
        tipoResidencia: data.tipoResidencia,
        tipoLogradouro: data.tipoLogradouro,
        logradouro: data.logradouro,
        numero: data.numero,
        bairro: data.bairro,
        cep: data.cep,
        cidade: data.cidade,
        estado: data.estado,
        pais: data.pais,
        observacoes: data.observacoes,
      }
    })
  }

  async updateCartaoPreferencial(data: UpdateCartaoPreferencial) {

    const cartao = await prisma.cartao.findUnique({
      where: { id: data.cartaoId }
    })

    const cartaoPreferencial = await prisma.cartao.findFirst({
      where: {
        user: { id: cartao?.userId },
        preferencial: true
      }
    })

    if (cartaoPreferencial && data.preferencial === true) {
      await prisma.cartao.update({
        where: { id: cartaoPreferencial.id },
        data: {
          preferencial: false
        }
      })
    }

    return prisma.cartao.update({
      where: { id: data.cartaoId },
      data: {
        preferencial: data.preferencial
      }
    })
  }

  async updateStatusUser(data: UpdateStatusUser) {
    return prisma.user.update({
      where: { id: data.userId },
      data: {
        status: data.status
      }
    })
  }

  async deleteUser(userId: number) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }

  async getUser(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        telefone: true,
        cartoes: true,
        enderecos: true
      }
    });
  }

  async getEnderecos(userId: number) {
    return prisma.endereco.findMany({
      where: { userId: userId },
    });
  }

  async getEndereco(enderecoId: number) {
    return prisma.endereco.findUnique({
      where: { id: enderecoId },
    });
  }

  async getCartoes(userId: number) {
    return prisma.cartao.findMany({
      where: { userId: userId },
    });
  }

  async getUsersFiltres(filters: GetUsersFiltresDto) {
    const conditions: any[] = [];

    if (filters.nome) {
      conditions.push({ nome: { contains: filters.nome, mode: "insensitive" } });
    }
    if (filters.cpf) {
      conditions.push({ cpf: filters.cpf });
    }
    if (filters.email) {
      conditions.push({ email: { contains: filters.email, mode: "insensitive" } });
    }
    if (filters.telefone) {
      conditions.push({
        telefone: { numero: { contains: filters.telefone } },
      });
    }

    return prisma.user.findMany({
      where: conditions.length > 0 ? { OR: conditions } : {}, // se não tiver filtro, retorna todos
      select: {
        id: true,
        nome: true,
        status: true,
      },
    });
  }


}
