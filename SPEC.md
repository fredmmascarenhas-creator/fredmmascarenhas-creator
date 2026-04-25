# OncoInbox AI — SPEC.md

## 1. Visão Geral
Sistema de organização automática de mensagens clínicas recebidas via WhatsApp para equipes de oncologia. O sistema utiliza IA (Gemini) para classificar, resumir e extrair dados de mensagens, criando uma fila de tarefas e eventos clínicos.

## 2. Arquitetura Técnica
- **Frontend**: React 18+, Vite, Tailwind CSS, Lucide React (ícones), Motion (animações).
- **Backend/Simulação**: Como este é um applet, o processamento será simulado via serviços no frontend que utilizam o `GEMINI_API_KEY`.
- **Banco de Dados**: Simulação de banco de dados (in-memory ou localStorage para persistência de sessão) ou pronto para integração com Firebase/Supabase.
- **IA**: Google Gemini API para classificação e extração de entidades.

## 3. Estrutura de Dados (Entidades)
### Mensagem (WhatsAppMessage)
- ID, Remetente, Telefone, Texto Original, Timestamp, Processado (boolean).

### Classificação (Classification)
- Categoria (tratamento_aprovado, complicacao_clinica, etc.), Prioridade, Resumo, Paciente Extraído, Dados Estruturados (JSON).

### Paciente (Patient)
- Nome, Data Nascimento, Convênio, Diagnóstico.

### Tarefa (Task)
- Título, Descrição, Responsável, Status, Prioridade, Evento Origem.

## 4. Fluxo de Trabalho (Core Pipeline)
1. **Input**: Simulação de recepção de webhook de mensagem.
2. **Processamento**: Chamada ao Gemini com Prompt de Classificação.
3. **Persistência**: Registro da mensagem classificada e criação de tarefa automática.
4. **UI**: Atualização do Dashboard (estilo ClickUp) com alertas e filas.

## 5. Design UI/UX
- **Paleta de COres**: Tons sóbrios (azuis marinhos, cinzas espaciais, branco off-white).
- **Layout**: Sidebar lateral, Header funcional, Viewport central com Tabs ou Listas.
- **Interatividade**: Transições suaves, badges de prioridade coloridos, modais para detalhes de mensagens.

## 6. Endpoints de Simulação
- `classify(text)`: Retorna o JSON estruturado conforme o prompt definido no plano.
- `addTask(task)`: Adiciona à fila global.
- `resolveTask(id)`: Remove ou marca como concluído.
