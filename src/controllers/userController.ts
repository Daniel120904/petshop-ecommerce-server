import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { userValidations } from "../validations/userValidations";

const userService = new UserService();

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body)
      return res.status(200).json(user)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async createTelefone(req: Request, res: Response) {
    try {
      const telefone = await userService.createTelefone(req.body)
      res.status(200).json(telefone)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async createEndereco(req: Request, res: Response) {
    try {
      const endereco = await userService.createEndereco(req.body)
      res.status(200).json(endereco)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async createCartao(req: Request, res: Response) {
    try {
      const cartao = await userService.createCartao(req.body)
      res.status(200).json(cartao)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userService.getUsers()
      res.status(200).json(users)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await userService.updateUser(req.body)
      res.status(200).json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateTelefone(req: Request, res: Response) {
    try {
      const telefone = await userService.updateTelefone(req.body)
      res.status(200).json(telefone)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateSenha(req: Request, res: Response) {
    try {
      const user = await userService.updateSenha(req.body)
      res.status(200).json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateEndereco(req: Request, res: Response) {
    try {
      const endereco = await userService.updateEndereco(req.body)
      res.status(200).json(endereco)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateCartaoPreferencial(req: Request, res: Response) {
    try {
      const cartao = await userService.updateCartaoPreferencial(req.body)
      res.status(200).json(cartao)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async updateStatusUser(req: Request, res: Response) {
    try {
      const user = await userService.updateStatusUser(req.body)
      res.status(200).json(user)
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      await userService.deleteUser(userId);
      res.status(200).json("Usuário deletado");
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const user = await userService.getUser(userId);
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getEnderecos(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const enderecos = await userService.getEnderecos(userId);
      res.status(200).json(enderecos);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getEndereco(req: Request, res: Response) {
    try {
      const enderecoId = Number(req.query.enderecoId);
      const endereco = await userService.getEndereco(enderecoId);
      res.status(200).json(endereco);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getCartoes(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId);
      const cartoes = await userService.getCartoes(userId);
      res.status(200).json(cartoes);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUsersFiltres(req: Request, res: Response) {
    try {
      const filters = userValidations.GetUsersFiltres.parse(req.query);

      const users = await userService.getUsersFiltres(filters);

      return res.status(200).json(users);
    } catch (error: any) {
      console.error(error);
      return res.status(400).json({
        message: error.message || "Erro ao buscar usuários",
      });
    }
  }

}
