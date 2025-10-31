export interface CreateSaleInput {
  addressId: number
  couponCode?: string 
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