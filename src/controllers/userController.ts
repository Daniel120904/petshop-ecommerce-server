import { Request, Response } from "express";
import { UserService } from "../services/userService";

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

}
