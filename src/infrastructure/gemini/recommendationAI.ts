//infrastructure/gemini/recommendationAi.ts

import { GoogleGenAI } from "@google/genai";
import "dotenv/config"; // Para carregar a GEMINI_API_KEY

// Inicializa o cliente Gemini
// Ele buscará automaticamente a chave da variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI({});
const model = "gemini-2.5-flash"; // Modelo ideal para respostas rápidas de chat

/**
 * Interface para tipar os dados simplificados do produto.
 */
interface ProductData {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory: string;
  quantity: number;
}

/**
 * Gera uma recomendação de produto baseada na mensagem do usuário e na lista de produtos.
 * @param userMessage A mensagem que o usuário digitou no chat.
 * @param products Uma lista dos produtos disponíveis no banco de dados.
 * @returns O texto de recomendação gerado pela IA.
 */
export async function getAiRecommendation(
  userMessage: string,
  products: ProductData[]
): Promise<string> {
  // 1. Formata os produtos para o prompt da IA (texto simples e estruturado)
  const productListString = products
    .map(
      (p) =>
        `ID: ${p.id}, Nome: "${p.name}", Preço: R$${p.price.toFixed(
          2
        )}, Categoria: ${p.category}, Subcategoria: ${p.subcategory
        }, Estoque: ${p.quantity > 0 ? "Disponível" : "Esgotado"}`
    )
    .join("\n");

  // 2. Constrói o prompt com instruções claras para a IA
  const prompt = `Você é um assistente de recomendação de produtos para um e-commerce de pet shop. Sua tarefa é analisar a 'Mensagem do Cliente' e, com base na 'Lista de Produtos', recomendar o produto mais adequado.

Regras de Recomendação:
1. Recomende **apenas um** produto da lista que seja mais relevante.
2. Priorize produtos com 'Estoque: Disponível' (quantity > 0).
3. Sua resposta deve ser **amigável e persuasiva**, mencionando o nome do produto, o preço e uma breve justificativa.
4. O cliente não deve ver a Lista de Produtos. Sua saída deve ser **apenas o texto de recomendação**.

---
Mensagem do Cliente: "${userMessage}"

---
Lista de Produtos (para sua análise):
${productListString}

---
Resposta do Chatbot:`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    if (!response.text) {
      console.error("A IA retornou uma resposta vazia ou indefinida.");
      return "Ops! Tivemos um problema para gerar a recomendação. Por favor, tente refinar sua busca.";
    }

    return response.text.trim();
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    // Retorna uma mensagem amigável em caso de falha
    return "Ops! Tivemos um problema para buscar a melhor recomendação agora. Por favor, tente novamente em alguns instantes.";
  }
}