// Status de Tarefas (Issues)
export const issueStatusLabels: Record<string, string> = {
  backlog: "Backlog",
  todo: "A Fazer",
  in_progress: "Em Andamento",
  in_review: "Em Revisão",
  blocked: "Bloqueado",
  done: "Concluído",
  cancelled: "Cancelado",
};

// Prioridades
export const priorityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
  urgent: "Urgente",
  none: "Nenhuma",
};

// Status de Agentes
export const agentStatusLabels: Record<string, string> = {
  active: "Ativo",
  idle: "Inativo",
  paused: "Pausado",
  running: "Em Execução",
  error: "Erro",
  pending_approval: "Aguardando Aprovação",
  terminated: "Encerrado",
};

// Status de Execuções (Heartbeat Runs)
export const runStatusLabels: Record<string, string> = {
  queued: "Na Fila",
  running: "Em Execução",
  succeeded: "Sucesso",
  failed: "Falhou",
  cancelled: "Cancelado",
  timed_out: "Tempo Esgotado",
};

// Status de Aprovações
export const approvalStatusLabels: Record<string, string> = {
  pending: "Pendente",
  revision_requested: "Revisão Solicitada",
  approved: "Aprovado",
  rejected: "Rejeitado",
};

// Status de Membros
export const membershipStatusLabels: Record<string, string> = {
  pending: "Pendente",
  active: "Ativo",
  suspended: "Suspenso",
};

// Status de Rotinas
export const routineRunStatusLabels: Record<string, string> = {
  issue_created: "Tarefa Criada",
  coalesced: "Combinado",
  skipped: "Ignorado",
  completed: "Concluído",
  failed: "Falhou",
};

// Status de Workspace Runtime
export const runtimeStatusLabels: Record<string, string> = {
  starting: "Iniciando",
  running: "Em Execução",
  stopped: "Parado",
  failed: "Falhou",
  cleanup_failed: "Limpeza Falhou",
};

// Saúde do Runtime
export const runtimeHealthLabels: Record<string, string> = {
  healthy: "Saudável",
  unhealthy: "Com Problemas",
  unknown: "Desconhecido",
};

// Status de Plugins
export const pluginJobStatusLabels: Record<string, string> = {
  active: "Ativo",
  paused: "Pausado",
  failed: "Falhou",
};

// Status de Auth Challenge
export const authChallengeStatusLabels: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  cancelled: "Cancelado",
  expired: "Expirado",
};

// Tipos de Ação do Log de Atividade
export const activityActionLabels: Record<string, string> = {
  "approval.created": "Aprovação criada",
  "approval.approved": "Aprovação concedida",
  "approval.rejected": "Aprovação rejeitada",
  "activity.logged": "Atividade registrada",
  "issue.created": "Tarefa criada",
  "issue.updated": "Tarefa atualizada",
  "issue.status_changed": "Status da tarefa alterado",
  "issue.assigned": "Tarefa atribuída",
  "issue.commented": "Comentário na tarefa",
  "agent.created": "Agente criado",
  "agent.updated": "Agente atualizado",
  "agent.paused": "Agente pausado",
  "agent.resumed": "Agente retomado",
  "agent.deleted": "Agente excluído",
  "run.started": "Execução iniciada",
  "run.completed": "Execução concluída",
  "run.failed": "Execução falhou",
  "run.cancelled": "Execução cancelada",
  "project.created": "Projeto criado",
  "project.updated": "Projeto atualizado",
  "company.updated": "Empresa atualizada",
  "goal.created": "Meta criada",
  "goal.updated": "Meta atualizada",
};

// Dashboard aggregation labels
export const dashboardLabels: Record<string, string> = {
  active: "Ativos",
  running: "Em Execução",
  paused: "Pausados",
  error: "Com Erro",
  open: "Abertas",
  inProgress: "Em Andamento",
  blocked: "Bloqueadas",
  done: "Concluídas",
};

// Status de Plugins (registro)
export const pluginRecordStatusLabels: Record<string, string> = {
  ready: "Pronto",
  error: "Erro",
  disabled: "Desativado",
  installing: "Instalando",
};

// Mensagens de execução de rotina
export const routineExecutionMessages: Record<string, string> = {
  "Routine execution": "Execução de rotina",
};

// Generic translate function
export function t(value: string, map: Record<string, string>): string {
  return map[value] ?? value;
}

// Convenience functions
export function translateStatus(status: string): string {
  return (
    issueStatusLabels[status] ??
    agentStatusLabels[status] ??
    runStatusLabels[status] ??
    status
  );
}

export function translatePriority(priority: string): string {
  return priorityLabels[priority] ?? priority;
}
