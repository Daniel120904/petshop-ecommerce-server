export interface CreateSaleInput {
  addressId: number
  couponCode?: string 
  payments?: { cardId: number; amount: number }[]
}