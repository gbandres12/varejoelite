import { GoogleGenAI } from "@google/genai";
import { Store, KPI } from "./types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

export const getStoreInsights = async (store: Store) => {
  const kpiDetails = store.kpis.map(k =>
    `- ${k.name}: Alvo ${k.target}${k.unit}, Realizado ${k.actual}${k.unit} (${Math.round((k.actual / k.target) * 100)}%)`
  ).join('\n');

  const prompt = `
    Como um consultor sênior de varejo especializado em estratégia para redes de supermercados, analise o desempenho da loja "${store.fantasia}".
    
    Os indicadores de avaliação são: Meta do Trimestre, Crescimento vs Ano Anterior, Participação no PDV (Share) e Volume em Toneladas.
    
    KPIs atuais:
    ${kpiDetails}
    
    Por favor, forneça uma análise detalhada contendo:
    1. Uma avaliação estratégica do momento da loja frente ao mercado.
    2. Sugestões específicas para aumentar a "Participação no PDV" e o "Volume em Toneladas" (ex: ações de cross-merchandising, pontos extras, promoções de volume).
    3. Uma mensagem motivacional curta para o gerente ${store.manager}.
    
    Responda em Português de forma profissional, executiva e prática. Use Markdown para formatação.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao obter insights do Gemini:", error);
    return "Não foi possível gerar insights automáticos no momento. Verifique sua conexão ou tente novamente mais tarde.";
  }
};