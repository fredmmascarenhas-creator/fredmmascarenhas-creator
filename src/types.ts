export enum UserRole {
  MEDICO = "medico",
  SECRETARIA = "secretaria",
  ENFERMEIRA = "enfermeira",
  FARMACEUTICO = "farmaceutico",
  ADMIN = "admin",
}

export enum MessageCategory {
  TRATAMENTO_APROVADO = "tratamento_aprovado",
  PACIENTE_EM_TRATAMENTO = "paciente_em_tratamento",
  COMPLICACAO_CLINICA = "complicacao_clinica",
  RELATORIO_PENDENTE = "relatorio_pendente",
  PENDENCIA_ADMINISTRATIVA = "pendencia_administrativa",
  PENDENCIA_FARMACIA = "pendencia_farmacia",
  MENSAGEM_NAO_CLASSIFICADA = "mensagem_nao_classificada",
}

export enum Priority {
  BAIXA = "baixa",
  ROTINA = "rotina",
  ALTA = "alta",
  URGENTE = "urgente",
}

export enum TaskStatus {
  NOVA = "nova",
  EM_ANDAMENTO = "em_andamento",
  AGUARDANDO_MEDICO = "aguardando_medico",
  RESOLVIDA = "resolvida",
  ARQUIVADA = "arquivada",
}

export interface Patient {
  id: string;
  fullName: string;
  birthDate?: string;
  phone?: string;
  healthInsurance?: string;
  diagnosisSummary?: string;
  active: boolean;
}

export interface WhatsAppMessage {
  id: string;
  senderName: string;
  text: string;
  receivedAt: string;
  processed: boolean;
}

export interface ClinicalTask {
  id: string;
  patientId?: string;
  title: string;
  description: string;
  category: MessageCategory;
  priority: Priority;
  status: TaskStatus;
  assignedRole: UserRole;
  createdAt: string;
  messageId: string;
  summary?: string;
  symptoms?: string[];
  medications?: string[];
}

export interface ClassificationResult {
  categoria: MessageCategory;
  paciente: {
    nome: string | null;
    identificador_externo?: string | null;
    telefone?: string | null;
    confianca_identificacao: number;
  };
  prioridade: Priority;
  resumo: string;
  dados_extraidos: {
    sintomas: string[];
    tratamento_citado: string | null;
    medicamentos: string[];
    ciclo: string | null;
    convenio: string | null;
    data_evento: string | null;
    prazo?: string | null;
    documentos_solicitados: string[];
    observacoes?: string | null;
  };
  acao_sugerida: string;
  responsavel_sugerido: string;
  deve_alertar_medico: boolean;
  deve_enviar_openclaw: boolean;
  motivo_alerta?: string | null;
  confianca_classificacao: number;
  necessita_revisao_humana?: boolean;
}
