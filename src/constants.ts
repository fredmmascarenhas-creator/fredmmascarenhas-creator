import { MessageCategory, Priority, TaskStatus, UserRole, ClinicalTask, Patient, WhatsAppMessage } from './types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "p1",
    fullName: "Maria Silva",
    birthDate: "1965-04-12",
    phone: "5571999991111",
    healthInsurance: "Bradesco",
    diagnosisSummary: "Câncer de pulmão em tratamento sistêmico",
    active: true
  },
  {
    id: "p2",
    fullName: "Carlos Almeida",
    birthDate: "1958-09-20",
    phone: "5571999992222",
    healthInsurance: "SulAmérica",
    diagnosisSummary: "Neoplasia colorretal metastática",
    active: true
  },
  {
    id: "p3",
    fullName: "Ana Paula Santos",
    birthDate: "1972-01-05",
    phone: "5571999993333",
    healthInsurance: "Unimed",
    diagnosisSummary: "Câncer de mama HER2 positivo",
    active: true
  }
];

export const INITIAL_TASKS: ClinicalTask[] = [
  {
    id: "t1",
    patientId: "p2",
    title: "Avaliar febre pós-quimioterapia",
    description: "Paciente Carlos apresentou febre de 38,5 após quimioterapia realizada no dia anterior.",
    category: MessageCategory.COMPLICACAO_CLINICA,
    priority: Priority.URGENTE,
    status: TaskStatus.NOVA,
    assignedRole: UserRole.MEDICO,
    createdAt: new Date().toISOString(),
    messageId: "m1",
    symptoms: ["febre"]
  },
  {
    id: "t2",
    patientId: "p1",
    title: "Agendar início do tratamento approved",
    description: "Convênio liberou pembrolizumabe para a paciente Maria Silva.",
    category: MessageCategory.TRATAMENTO_APROVADO,
    priority: Priority.ROTINA,
    status: TaskStatus.EM_ANDAMENTO,
    assignedRole: UserRole.SECRETARIA,
    createdAt: new Date().toISOString(),
    messageId: "m2"
  }
];
