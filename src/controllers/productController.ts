import { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();
const productService = new ProductService()

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const products = await productService.getProducts()
      return res.status(200).json(products)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async getCartItems(req: Request, res: Response) {
    try {
      const productsCart = await productService.getCartItems()
      return res.status(200).json(productsCart)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async updateCartItens(req: Request, res: Response) {
    try {
      await productService.updateCartItens(req.body)
      return res.status(200).json("Carrinho atualizado")
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await productService.getCategories()
      return res.status(200).json(categories)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async getAiRecommendation(req: Request, res: Response) {
    try {
      const message = await productService.getAiRecommendation(req.body)
      return res.status(200).json(message)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}
