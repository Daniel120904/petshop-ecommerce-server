export interface updateCartItens {
    item: number
    action: "more" | "less"
}

export interface GetAiRecommendation {
    message: string
}