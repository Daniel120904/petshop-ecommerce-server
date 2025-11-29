export interface CreateSaleInput {
  addressId: number
  payments?: { cardId: number; amount: number }[]
}

export interface GetSales {
  dataStart: Date
  dataEnd: Date
}

export interface updateStatusSale {
  id: number
  status: string
}

export interface getSalesByCategory {
  dataStart?: string
  dataEnd?: string
  categoriesId: string[]
}