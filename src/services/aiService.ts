import { GoogleGenAI } from "@google/genai";
import { MessageCategory, Priority, ClassificationResult } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const CLASSIFIER_PROMPT = `
Você é um classificador de mensagens clínicas de oncologia avançado.
Sua função é transformar mensagens de WhatsApp em dados estruturados.

### REGRAS:
- Não invente informações. Se não houver nome do paciente, use null.
- Complicações clínicas (febre, dor, falta de ar) devem ser prioridade URGENTE ou ALTA.
- Febre após quimio = URGENTE.
- Retorne APENAS um objeto JSON puro, sem markdown.

### ESPECIFICAÇÃO DO JSON:
{
  "categoria": "mencione uma das: tratamento_aprovado, paciente_em_tratamento, complicacao_clinica, relatorio_pendente, pendencia_administrativa, pendencia_farmacia, mensagem_nao_classificada",
  "paciente": { "nome": string|null, "confianca_identificacao": number 0-1 },
  "prioridade": "baixa | rotina | alta | urgente",
  "resumo": "breve resumo da mensagem",
  "dados_extraidos": {
    "sintomas": string[],
    "tratamento_citado": string|null,
    "medicamentos": string[],
    "ciclo": string|null,
    "convenio": string|null,
    "data_evento": string|null,
    "documentos_solicitados": string[]
  },
  "acao_sugerida": "o que a equipe deve fazer?",
  "responsavel_sugerido": "medico | secretaria | enfermeira | farmaceutico",
  "deve_alertar_medico": boolean,
  "deve_enviar_openclaw": boolean,
  "confianca_classificacao": number 0-1
}
`;

export async function classifyMessage(text: string): Promise<ClassificationResult> {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
  }

  try {
    const prompt = `${CLASSIFIER_PROMPT}\n\nMENSAGEM PARA CLASSIFICAR:\n"${text}"`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const jsonString = response.text || "{}";
    return JSON.parse(jsonString) as ClassificationResult;
  } catch (error) {
    console.error("Classification error:", error);
    // Fallback classification if AI fails
    return {
      categoria: MessageCategory.MENSAGEM_NAO_CLASSIFICADA,
      paciente: { nome: null, identificador_externo: null, telefone: null, confianca_identificacao: 0 },
      prioridade: Priority.ROTINA,
      resumo: text.substring(0, 50),
      dados_extraidos: { sintomas: [], tratamento_citado: null, medicamentos: [], ciclo: null, convenio: null, data_evento: null, prazo: null, documentos_solicitados: [], observacoes: "Erro no processamento de IA" },
      acao_sugerida: "Revisar manualmente - Falha na IA",
      responsavel_sugerido: "admin",
      deve_alertar_medico: false,
      deve_enviar_openclaw: false,
      motivo_alerta: null,
      confianca_classificacao: 0,
      necessita_revisao_humana: true
    };
  }
}
