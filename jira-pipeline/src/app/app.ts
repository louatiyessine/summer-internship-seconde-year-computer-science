import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface PipelineStep {
  id: string;
  label: string;
  status: 'waiting' | 'running' | 'success' | 'error';
  detail: string;
}

interface ToolCall {
  tool: string;
  args: any;
  result: string;
  open: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // ─── Base URL du backend Flask ───
  readonly baseUrl = 'http://localhost:5000';

  // ─── Formulaire du pipeline ───
  ticketKey: string = '';
  selectedAgent: string = 'gemini';
  isLoading: boolean = false;

  // ─── Étapes du pipeline ───
  steps: PipelineStep[] = [
    { id: 'read',    label: 'Lecture du ticket',          status: 'waiting', detail: '' },
    { id: 'analyze', label: "Analyse de l'intention",     status: 'waiting', detail: '' },
    { id: 'prompt',  label: 'Génération du prompt',       status: 'waiting', detail: '' },
    { id: 'agent',   label: "Exécution par l'agent (MCP)", status: 'waiting', detail: '' },
    { id: 'done',    label: 'Terminé',                    status: 'waiting', detail: '' },
  ];

  // ─── Données réelles récupérées du backend ───
  ticketTitre: string = '';
  ticketType: string = '';
  ticketStatut: string = '';
  intention: string = '';
  promptGenere: string = '';
  showPrompt: boolean = false;

  // ─── Démarche réelle : les outils MCP appelés ───
  toolCalls: ToolCall[] = [];

  // ─── Résultat final ───
  result: string = '';
  tokens: number = 0;
  error: string = '';

  // ─── Testeur d'API (mode « Postman ») ───
  httpMethods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  httpMethod: string = 'POST';
  apiUrl: string = `${this.baseUrl}/api/mcp/run`;
  apiBody: string = '{\n  "question": "Resous le ticket SCRUM-1",\n  "agent": "gemini"\n}';
  apiResult: string = '';
  apiLoading: boolean = false;

  // En mode zoneless, on doit prévenir Angular de rafraîchir l'affichage
  // après une opération asynchrone (setTimeout, réponse HTTP...).
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  // Remet le pipeline à zéro
  resetSteps() {
    this.steps.forEach(s => {
      s.status = 'waiting';
      s.detail = '';
    });
    this.result = '';
    this.tokens = 0;
    this.error = '';
    this.ticketTitre = '';
    this.ticketType = '';
    this.ticketStatut = '';
    this.intention = '';
    this.promptGenere = '';
    this.showPrompt = false;
    this.toolCalls = [];
  }

  // Met à jour une étape puis demande un rafraîchissement de l'affichage
  setStep(id: string, status: PipelineStep['status'], detail: string = '') {
    const step = this.steps.find(s => s.id === id);
    if (step) {
      step.status = status;
      step.detail = detail;
    }
    this.cdr.markForCheck();
  }

  // Traduit le code d'intention en libellé lisible
  labelIntention(code: string): string {
    const labels: { [k: string]: string } = {
      correction_bug: 'Correction de bug',
      generation_code: 'Génération de code',
      analyse_generale: 'Analyse générale',
    };
    return labels[code] || code;
  }

  // Détermine à quel serveur MCP appartient un outil (pour la couleur du badge)
  toolServer(tool: string): string {
    if (tool.startsWith('jira__')) return 'jira';
    if (tool.startsWith('fs__')) return 'fs';
    if (tool.startsWith('atlassian__')) return 'atlassian';
    return 'autre';
  }

  // Résume les arguments d'un outil de façon compacte
  formatArgs(args: any): string {
    try {
      return JSON.stringify(args, null, 2);
    } catch {
      return String(args);
    }
  }

  // Traduit un nom d'outil technique en libellé lisible + icône (pour l'architecture)
  toolMeta(tool: string): { icon: string; title: string } {
    const name = tool.replace(/^jira__|^fs__|^atlassian__/, '');
    const map: { [k: string]: { icon: string; title: string } } = {
      solve_jira_ticket: { icon: '🎫', title: 'Résolution du ticket Jira' },
      search_files:      { icon: '🔍', title: 'Recherche du projet / fichier' },
      read_file:         { icon: '📄', title: "Lecture d'un fichier" },
      read_text_file:    { icon: '📄', title: "Lecture d'un fichier" },
      write_file:        { icon: '📝', title: "Création / écriture d'un fichier" },
      edit_file:         { icon: '✏️', title: "Modification d'un fichier" },
      list_directory:    { icon: '📁', title: "Liste d'un dossier" },
      create_directory:  { icon: '📁', title: "Création d'un dossier" },
      move_file:         { icon: '➡️', title: "Déplacement d'un fichier" },
      get_file_info:     { icon: 'ℹ️', title: "Infos d'un fichier" },
      directory_tree:    { icon: '🌳', title: "Arborescence d'un dossier" },
    };
    return map[name] || { icon: '⚙️', title: name.replace(/_/g, ' ') };
  }

  // Aperçu court du résultat d'un outil (pour ne pas afficher un mur de texte)
  resultPreview(result: string): string {
    const clean = (result || '').replace(/\s+/g, ' ').trim();
    return clean.length > 160 ? clean.slice(0, 160) + '…' : clean;
  }

  // Extrait la « cible » d'un outil (nom du fichier, clé de ticket, projet...) pour l'afficher
  toolTarget(args: any): string {
    if (!args || typeof args !== 'object') return '';
    const cheminsKeys = ['path', 'source', 'destination'];
    for (const k of cheminsKeys) {
      if (args[k]) {
        const parts = String(args[k]).split(/[\\/]/);
        return parts[parts.length - 1] || String(args[k]);
      }
    }
    for (const k of ['ticket_key', 'project_name', 'query']) {
      if (args[k]) return String(args[k]);
    }
    const first = Object.values(args)[0];
    return first != null ? String(first).slice(0, 50) : '';
  }

  // Fait apparaître les outils appelés un par un (effet « démarche en direct »)
  async revealToolCalls(actions: any[]) {
    for (const a of actions) {
      this.toolCalls.push({
        tool: a.tool,
        args: a.args,
        result: a.result,
        open: false,
      });
      this.cdr.markForCheck();
      await this.delay(500);
    }
  }

  // Lance le pipeline complet avec de VRAIES données à chaque étape
  async runPipeline() {
    if (!this.ticketKey.trim()) {
      this.error = 'Entre une clé de ticket (ex: SCRUM-1)';
      return;
    }

    this.resetSteps();
    this.isLoading = true;

    // ── Étapes 1 à 3 : préparation (lecture + analyse + prompt) ──
    this.setStep('read', 'running');

    this.http.post<any>(`${this.baseUrl}/api/pipeline/prepare`, {
      cle_ticket: this.ticketKey.trim()
    }).subscribe({
      next: async (prep) => {
        // Étape 1 — Lecture du ticket (données réelles de Jira)
        this.ticketTitre = prep.ticket.titre;
        this.ticketType = prep.ticket.type;
        this.ticketStatut = prep.ticket.statut;
        this.setStep('read', 'success', `${prep.ticket.titre} — ${prep.ticket.type}`);

        await this.delay(350);

        // Étape 2 — Intention détectée (réelle)
        this.setStep('analyze', 'running');
        await this.delay(300);
        this.intention = prep.intention;
        this.setStep('analyze', 'success', this.labelIntention(prep.intention));

        // Étape 3 — Prompt construit (réel)
        this.setStep('prompt', 'running');
        await this.delay(300);
        this.promptGenere = prep.prompt;
        this.setStep('prompt', 'success', `Prompt construit (${prep.prompt.length} caractères)`);

        // ── Étape 4 : exécution MCP RÉELLE (agit sur les fichiers) ──
        this.setStep('agent', 'running', 'Connexion aux serveurs MCP + exécution des outils...');
        const instruction =
          `Traite le ticket ${this.ticketKey.trim()} de bout en bout. ` +
          `Étapes : 1) lis et analyse le ticket, ` +
          `2) trouve le dossier du projet concerné avec l'outil fs__search_files en utilisant un motif RÉCURSIF "**/<nom du projet>" (un simple "*" ne descend pas dans les sous-dossiers), ` +
          `3) crée ou modifie RÉELLEMENT les fichiers nécessaires avec les outils fs__ ` +
          `(write_file, edit_file). Agis vraiment sur les fichiers, ne te contente pas de répondre du texte.`;
        this.http.post<any>(`${this.baseUrl}/api/mcp/run`, {
          question: instruction,
          agent: this.selectedAgent
        }).subscribe({
          next: async (res) => {
            // On révèle chaque outil MCP réellement appelé, un par un
            if (res.actions && res.actions.length) {
              await this.revealToolCalls(res.actions);
              this.setStep('agent', 'success', `${res.actions.length} outil(s) MCP exécuté(s)`);
            } else {
              this.setStep('agent', 'success', 'Réponse directe (aucun outil appelé)');
            }
            this.setStep('done', 'success', 'Pipeline terminé avec succès');
            this.result = res.reponse || JSON.stringify(res, null, 2);
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.setStep('agent', 'error', "Erreur lors de l'exécution MCP");
            this.setStep('done', 'error', 'Pipeline échoué');
            this.error = err.error?.erreur || 'Erreur de connexion à Flask';
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
      },
      error: (err) => {
        this.setStep('read', 'error', 'Impossible de lire le ticket');
        this.error = err.error?.erreur || 'Erreur de connexion à Flask (lance python app.py)';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // Teste une route API manuellement (comme Postman) — GET / POST / PUT...
  testApi() {
    this.apiResult = 'Chargement...';
    this.apiLoading = true;

    // Les méthodes sans corps (GET, DELETE) ignorent le body
    const avecCorps = this.httpMethod !== 'GET' && this.httpMethod !== 'DELETE';
    let bodyParsed: any = undefined;

    if (avecCorps) {
      try {
        bodyParsed = this.apiBody ? JSON.parse(this.apiBody) : {};
      } catch {
        this.apiResult = 'Erreur : JSON invalide dans le body';
        this.apiLoading = false;
        return;
      }
    }

    this.http.request<any>(this.httpMethod, this.apiUrl, { body: bodyParsed }).subscribe({
      next: (res) => {
        this.apiResult = JSON.stringify(res, null, 2);
        this.apiLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.apiResult = JSON.stringify(err.error || err.message, null, 2);
        this.apiLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}