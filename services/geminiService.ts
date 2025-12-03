import { GoogleGenAI } from "@google/genai";
import { FinancialRecord, Supplier, Trip } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Função padrão para análise automática (botão rápido)
export const analyzeFinancialHealth = async (
  records: FinancialRecord[],
  suppliers: Supplier[],
  trips: Trip[]
): Promise<string> => {
  const prompt = `
    Você é um analista financeiro para um varejo de alimentos chamado "Mercado do Bairro".
    Analise os seguintes resumos de dados JSON e forneça um breve insight estratégico (máximo de 3 frases)
    em Português do Brasil, focando em fluxo de caixa, pagamentos atrasados e eficiência logística.

    Registros Financeiros: ${JSON.stringify(records.slice(0, 10))}
    Fornecedores: ${JSON.stringify(suppliers.slice(0, 5))}
    Viagens: ${JSON.stringify(trips.slice(0, 5))}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Nenhum insight disponível.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Não foi possível gerar insights de IA no momento.";
  }
};

// Nova função para perguntas customizadas do usuário
export const consultAiAssistant = async (
  userQuestion: string,
  records: FinancialRecord[],
  suppliers: Supplier[],
  trips: Trip[]
): Promise<string> => {
  const prompt = `
    Você é um assistente inteligente do ERP "Mercado do Bairro".
    O usuário (gestor) fez a seguinte pergunta: "${userQuestion}"

    Use APENAS os dados abaixo para responder. Se a resposta não estiver nos dados, diga que não sabe.
    Seja conciso, direto e profissional. Responda em Português do Brasil.

    DADOS DO SISTEMA:
    - Financeiro (Amostra): ${JSON.stringify(records)}
    - Fornecedores: ${JSON.stringify(suppliers)}
    - Logística/Viagens: ${JSON.stringify(trips)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não consegui formular uma resposta.";
  } catch (error) {
    console.error("Gemini Custom Query Error:", error);
    return "Erro ao consultar a IA. Tente novamente.";
  }
};