# OncoInbox AI — PRD (Product Requirements Document)

## 1. Problema
Oncologistas recebem centenas de mensagens dispersas em grupos de WhatsApp (médicos, enfermagem, farmácia, administrativa). Informações críticas como "Febre após quimio" podem se perder no mar de "Ok" e "Confirmado".

## 2. Solução
O OncoInbox centraliza essas mensagens, extrai o paciente e classifica a urgência. Transforma o WhatsApp em um "Inbox" médico organizado, onde o médico vê o que é clínico e urgente primeiro.

## 3. Requisitos Funcionais
- **Módulo de Entrada**: Simular o recebimento de mensagens de diferentes membros da equipe.
- **Dashboard de Alertas**: Fila de "Urgente" e "Alta" prioridade destacada.
- **Gestão de Tarefas**: Visualização estilo ClickUp para tarefas administrativas e clínicas.
- **Linha do Tempo do Paciente**: Histórico de mensagens associadas a um paciente específico.
- **Integração com IA**: Classificador robusto que identifica sintomas e tratamentos citados.

## 4. Requisitos Não-Funcionais
- **Segurança**: Simulação de RLS (Row Level Security).
- **Sobriedade**: Interface profissional, focada em saúde, sem distrações.
- **Performance**: Classificação rápida (IA).

## 5. Personas
- **Médico**: Focado em intercorrências e relatórios.
- **Secretária**: Focada em agendamentos e autorizações.
- **Enfermeira/Farmácia**: Focados no registro de ciclos e medicamentos.

## 6. Roadmap MVP
1. Recebimento e Classificação de Mensagens.
2. Dashboard Principal com Contadores de Urgência.
3. Detalhes de Paciente e Timeline.
4. Simulação de fluxo completo (Recebe -> Classifica -> Resolve).
