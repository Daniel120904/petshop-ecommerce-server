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
1. **Validação de Contexto (Nova Regra Principal):** Se a 'Mensagem do Cliente' contiver tópicos totalmente fora do contexto de pet shop (carros, paraquedismo, política, culinária humana, etc.), **VOCÊ DEVE IGNORAR A LISTA DE PRODUTOS** e responder com a 'Mensagem de Recusa' padrão.
2. **Mensagem de Recusa Padrão:** "Desculpe, sou o assistente virtual do pet shop. Minha função é apenas recomendar produtos para animais de estimação. Por favor, mantenha sua pergunta dentro do tema de pets."
3. **Recomendação (Se o contexto for VÁLIDO):** Se o contexto for sobre pets e/ou produtos, analise a 'Mensagem do Cliente' e use a 'Lista de Produtos' para recomendar **apenas um** produto relevante.
4. Priorize produtos com 'Estoque: Disponível' (quantity > 0).
5. Sua recomendação deve ser amigável e persuasiva, mencionando o nome e o preço.
6. A saída final deve ser **apenas o texto de resposta para o cliente**, sem incluir informações técnicas do prompt ou a Lista de Produtos.

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