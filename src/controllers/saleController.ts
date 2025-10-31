import { Request, Response } from "express";
import { SaleService } from "../services/saleService";
import { GetSales } from "../dtos/saleDto";

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

  async getCoupon(req: Request, res: Response) {
    try {
      const coupon = await saleService.getCupon(req.query.coupon as string)
      return res.status(200).json(coupon)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async getSales(req: Request, res: Response) {
    try {
      const sales = await saleService.getSales(req.body)
      return res.status(200).json(sales)
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }

  async updateStatusSale(req: Request, res: Response) {
    try {
      await saleService.updateStatusSale(req.body)
      return res.status(200).json("status atualizado")
    } catch (error: any) {
      return res.status(400).json({ message: error.message })
    }
  }
}