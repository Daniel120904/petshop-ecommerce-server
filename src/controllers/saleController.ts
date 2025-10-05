import { Request, Response } from "express";
import { SaleService } from "../services/saleService";

const saleService = new SaleService()

export class SaleController {
  async createSale(req: Request, res: Response) {
    try {
      const sale = await saleService.createSale(req.body)
      return res.status(200).json(sale)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async getSalesUser(req: Request, res: Response) {
    try {
      const sales = await saleService.getSalesUser()
      return res.status(200).json(sales)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}