import { useState, useRef, useEffect, useCallback } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";
import { AGENT_ROLE_LABELS } from "@paperclipai/shared";

/* ---- Help text for (?) tooltips ---- */
export const help: Record<string, string> = {
  name: "Nome de exibição deste agente.",
  title: "Cargo exibido no organograma.",
  role: "Função organizacional. Determina posição e capacidades.",
  reportsTo: "O agente ao qual este se reporta na hierarquia organizacional.",
  capabilities: "Descreve o que este agente pode fazer. Exibido no organograma e usado para roteamento de tarefas.",
  adapterType: "Como este agente executa: CLI local (Claude/Codex/OpenCode), OpenClaw Gateway, processo gerado ou webhook HTTP genérico.",
  cwd: "Fallback legado descontinuado de diretório de trabalho para adaptadores locais. Agentes existentes podem ainda carregar este valor, mas novas configurações devem usar workspaces de projeto.",
  promptTemplate: "Enviado a cada heartbeat. Mantenha pequeno e dinâmico. Use para contextualização da tarefa atual, não para instruções estáticas grandes. Suporta {{ agent.id }}, {{ agent.name }}, {{ agent.role }} e outras variáveis de template.",
  model: "Substitui o modelo padrão usado pelo adaptador.",
  thinkingEffort: "Controla a profundidade de raciocínio do modelo. Valores suportados variam por adaptador/modelo.",
  chrome: "Habilita a integração Chrome do Claude passando --chrome.",
  dangerouslySkipPermissions: "Executa sem supervisão aprovando automaticamente prompts de permissão do adaptador quando suportado.",
  dangerouslyBypassSandbox: "Executa o Codex sem restrições de sandbox. Necessário para acesso a sistema de arquivos/rede.",
  search: "Habilita a capacidade de busca web do Codex durante execuções.",
  workspaceStrategy: "Como o Paperclip deve realizar um workspace de execução para este agente. Mantenha project_primary para execução normal de cwd, ou use git_worktree para checkouts isolados por tarefa.",
  workspaceBaseRef: "Ref git base usada ao criar um branch de worktree. Deixe em branco para usar a ref resolvida do workspace ou HEAD.",
  workspaceBranchTemplate: "Template para nomear branches derivados. Suporta {{issue.identifier}}, {{issue.title}}, {{agent.name}}, {{project.id}}, {{workspace.repoRef}} e {{slug}}.",
  worktreeParentDir: "Diretório onde worktrees derivados devem ser criados. Caminhos absolutos, com prefixo ~ e relativos ao repositório são suportados.",
  runtimeServicesJson: "Definições opcionais de serviços de runtime do workspace. Use para servidores de app compartilhados, workers ou outros processos companheiros de longa duração vinculados ao workspace.",
  maxTurnsPerRun: "Número máximo de turnos agênticos (chamadas de ferramenta) por execução de heartbeat.",
  command: "O comando a executar (ex: node, python).",
  localCommand: "Substitui o caminho para o comando CLI que o adaptador deve chamar (ex: /usr/local/bin/claude, codex, opencode).",
  args: "Argumentos de linha de comando, separados por vírgula.",
  extraArgs: "Argumentos CLI extras para adaptadores locais, separados por vírgula.",
  envVars: "Variáveis de ambiente injetadas no processo do adaptador. Use valores simples ou referências a segredos.",
  bootstrapPrompt: "Enviado apenas quando o Paperclip inicia uma nova sessão. Use para orientações estáveis de configuração que não devem ser repetidas a cada heartbeat.",
  payloadTemplateJson: "JSON opcional mesclado nos payloads de requisição do adaptador remoto antes do Paperclip adicionar seus campos padrão de wake e workspace.",
  webhookUrl: "A URL que recebe requisições POST quando o agente é invocado.",
  heartbeatInterval: "Executa este agente automaticamente em um timer. Útil para tarefas periódicas como verificar novos trabalhos.",
  intervalSec: "Segundos entre invocações automáticas de heartbeat.",
  timeoutSec: "Máximo de segundos que uma execução pode levar antes de ser encerrada. 0 significa sem timeout.",
  graceSec: "Segundos para aguardar após enviar interrupção antes de forçar encerramento do processo.",
  wakeOnDemand: "Permite que este agente seja ativado por atribuições, chamadas de API, ações na UI ou sistemas automatizados.",
  cooldownSec: "Mínimo de segundos entre execuções consecutivas de heartbeat.",
  maxConcurrentRuns: "Número máximo de execuções de heartbeat que podem executar simultaneamente para este agente.",
  budgetMonthlyCents: "Limite de gasto mensal em centavos. 0 significa sem limite.",
};

import { getAdapterLabels } from "../adapters/adapter-display-registry";

export const adapterLabels = getAdapterLabels();

export const roleLabels = AGENT_ROLE_LABELS as Record<string, string>;

/* ---- Primitive components ---- */

export function HintIcon({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="inline-flex text-muted-foreground/50 hover:text-muted-foreground transition-colors">
          <HelpCircle className="h-3 w-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className="text-xs text-muted-foreground">{label}</label>
        {hint && <HintIcon text={hint} />}
      </div>
      {children}
    </div>
  );
}

export function ToggleField({
  label,
  hint,
  checked,
  onChange,
  toggleTestId,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  toggleTestId?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        {hint && <HintIcon text={hint} />}
      </div>
      <ToggleSwitch
        checked={checked}
        onCheckedChange={onChange}
        data-testid={toggleTestId}
      />
    </div>
  );
}

export function ToggleWithNumber({
  label,
  hint,
  checked,
  onCheckedChange,
  number,
  onNumberChange,
  numberLabel,
  numberHint,
  numberPrefix,
  showNumber,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  number: number;
  onNumberChange: (v: number) => void;
  numberLabel: string;
  numberHint?: string;
  numberPrefix?: string;
  showNumber: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">{label}</span>
          {hint && <HintIcon text={hint} />}
        </div>
        <ToggleSwitch
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
      </div>
      {showNumber && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {numberPrefix && <span>{numberPrefix}</span>}
          <input
            type="number"
            className="w-16 rounded-md border border-border px-2 py-0.5 bg-transparent outline-none text-xs font-mono text-center"
            value={number}
            onChange={(e) => onNumberChange(Number(e.target.value))}
          />
          <span>{numberLabel}</span>
          {numberHint && <HintIcon text={numberHint} />}
        </div>
      )}
    </div>
  );
}

export function CollapsibleSection({
  title,
  icon,
  open,
  onToggle,
  bordered,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(bordered && "border-t border-border")}>
      <button
        className="flex items-center gap-2 w-full px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-accent/30 transition-colors"
        onClick={onToggle}
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {icon}
        {title}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

export function AutoExpandTextarea({
  value,
  onChange,
  onBlur,
  placeholder,
  minRows,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  minRows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rows = minRows ?? 3;
  const lineHeight = 20;
  const minHeight = rows * lineHeight;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(minHeight, el.scrollHeight)}px`;
  }, [minHeight]);

  useEffect(() => { adjustHeight(); }, [value, adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      className="w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40 resize-none overflow-hidden"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      style={{ minHeight }}
    />
  );
}

/**
 * Text input that manages internal draft state.
 * Calls `onCommit` on blur (and optionally on every change if `immediate` is set).
 */
export function DraftInput({
  value,
  onCommit,
  immediate,
  className,
  ...props
}: {
  value: string;
  onCommit: (v: string) => void;
  immediate?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "className">) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  return (
    <input
      className={className}
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        if (immediate) onCommit(e.target.value);
      }}
      onBlur={() => {
        if (draft !== value) onCommit(draft);
      }}
      {...props}
    />
  );
}

/**
 * Auto-expanding textarea with draft state and blur-commit.
 */
export function DraftTextarea({
  value,
  onCommit,
  immediate,
  placeholder,
  minRows,
}: {
  value: string;
  onCommit: (v: string) => void;
  immediate?: boolean;
  placeholder?: string;
  minRows?: number;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rows = minRows ?? 3;
  const lineHeight = 20;
  const minHeight = rows * lineHeight;

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(minHeight, el.scrollHeight)}px`;
  }, [minHeight]);

  useEffect(() => { adjustHeight(); }, [draft, adjustHeight]);

  return (
    <textarea
      ref={textareaRef}
      className="w-full rounded-md border border-border px-2.5 py-1.5 bg-transparent outline-none text-sm font-mono placeholder:text-muted-foreground/40 resize-none overflow-hidden"
      placeholder={placeholder}
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        if (immediate) onCommit(e.target.value);
      }}
      onBlur={() => {
        if (draft !== value) onCommit(draft);
      }}
      style={{ minHeight }}
    />
  );
}

/**
 * Number input with draft state and blur-commit.
 */
export function DraftNumberInput({
  value,
  onCommit,
  immediate,
  className,
  ...props
}: {
  value: number;
  onCommit: (v: number) => void;
  immediate?: boolean;
  className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "className" | "type">) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  return (
    <input
      type="number"
      className={className}
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        if (immediate) onCommit(Number(e.target.value) || 0);
      }}
      onBlur={() => {
        const num = Number(draft) || 0;
        if (num !== value) onCommit(num);
      }}
      {...props}
    />
  );
}

/**
 * "Choose" button that opens a dialog explaining the user must manually
 * type the path due to browser security limitations.
 */
export function ChoosePathButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent/50 transition-colors shrink-0"
        onClick={() => setOpen(true)}
      >
        Escolher
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Especificar caminho manualmente</DialogTitle>
            <DialogDescription>
              A segurança do navegador impede apps de ler caminhos locais completos via seletor de arquivos.
              Copie o caminho absoluto e cole no campo de entrada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <section className="space-y-1.5">
              <p className="font-medium">macOS (Finder)</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Encontre a pasta no Finder.</li>
                <li>Segure <kbd>Option</kbd> e clique com botão direito na pasta.</li>
                <li>Clique em "Copiar &lt;nome da pasta&gt; como Pathname".</li>
                <li>Cole o resultado no campo de caminho.</li>
              </ol>
              <p className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                /Users/seuusuario/Documents/projeto
              </p>
            </section>
            <section className="space-y-1.5">
              <p className="font-medium">Windows (Explorador de Arquivos)</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Encontre a pasta no Explorador de Arquivos.</li>
                <li>Segure <kbd>Shift</kbd> e clique com botão direito na pasta.</li>
                <li>Clique em "Copiar como caminho".</li>
                <li>Cole o resultado no campo de caminho.</li>
              </ol>
              <p className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                C:\Users\seuusuario\Documents\projeto
              </p>
            </section>
            <section className="space-y-1.5">
              <p className="font-medium">Terminal alternativo (macOS/Linux)</p>
              <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                <li>Execute <code>cd /caminho/para/pasta</code>.</li>
                <li>Execute <code>pwd</code>.</li>
                <li>Copie a saída e cole no campo de caminho.</li>
              </ol>
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * Label + input rendered on the same line (inline layout for compact fields).
 */
export function InlineField({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 shrink-0">
        <label className="text-xs text-muted-foreground">{label}</label>
        {hint && <HintIcon text={hint} />}
      </div>
      <div className="w-24 ml-auto">{children}</div>
    </div>
  );
}
