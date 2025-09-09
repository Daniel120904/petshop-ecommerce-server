export interface CreateUserDto {
  nome: string;
  genero: string;
  dataNascimento: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface CreateTelefoneDto {
  tipo: string;
  ddd: string;
  numero: string;
  userId: number;
}

export interface CreateEnderecoDto {
  nome: string;
  tipoEndereco: string;
  tipoResidencia: string;
  tipoLogradouro: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  observacoes?: string;
  userId: number;
}

export interface CreateCartaoDto {
  nome: string;
  numero: string;
  bandeira: string;
  cvv: string;
  userId: number;
}

export interface UpdateUserDto {
  userId: number;
  nome: string;
  genero: string;
  dataNascimento: string;
  cpf: string;
  email: string;
}

export interface UpdateTelefoneDto {
  telefoneId: number;
  tipo: string;
  ddd: string;
  numero: string;
}

export interface UpdateSenha {
  userId: number;
  senhaAtual: string;
  novaSenha: string;
  confirmarNovaSenha: string;
}

export interface UpdateEndereco {
  enderecoId: number;
  nome: string;
  tipoEndereco: string;
  tipoResidencia: string;
  tipoLogradouro: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cep: string;
  cidade: string;
  estado: string;
  pais: string;
  observacoes?: string;
}

export interface UpdateCartaoPreferencial {
  cartaoId: number;
  preferencial: boolean;
}

export interface UpdateStatusUser {
  userId: number;
  status: boolean;
}

export interface GetUsersFiltresDto {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
}

