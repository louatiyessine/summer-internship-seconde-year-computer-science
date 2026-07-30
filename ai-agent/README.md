# ai-agent — Application web multi-agents (Flask)

Application Flask réunissant trois agents IA et une interface de chat à quatre modes.

## Agents

- **Agent 1 — Gemini 2.5 Flash + RAG** : répond à partir des documents de l'entreprise
  fictive *TechNova*, indexés dans une base vectorielle **ChromaDB**.
- **Agent 2 — Llama 3.2 (local via Ollama, sans RAG)** : point de comparaison.
- **Agent 3 — Jira** : lit un ticket via l'API REST Atlassian, détecte l'intention et
  transmet un prompt à l'Agent 1 ou 2.

Intégration **MCP** (Model Context Protocol) : résolution de tickets en deux temps
(*plan* → *execute*) avec commit/push Git.

## Modes d'interface

1. Demander à un agent
2. Comparer les deux agents (tokens + coût $)
3. Dialogue entre agents
4. Agent Jira (par clé de ticket)

## Démarrage

```bash
# 1. Copier le modèle d'environnement et renseigner vos clés
cp .env.example .env

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. (Agent 2) Ollama installé et modèle llama3.2 téléchargé
ollama pull llama3.2

# 4. Lancer le serveur
python app.py       # http://127.0.0.1:5000
```

## Structure

```
ai-agent/
├── app.py                 Serveur Flask (orchestrateur)
├── mcp_server.py          Serveur MCP (outils Jira / fichiers)
├── agents/                agent_gemini, agent_llama, agent_jira, dialogue
├── rag/                   Moteur RAG (ChromaDB) + documents
├── utils/                 Client d'agents, calcul de coût, client MCP
├── static/                Interface (index.html)
├── run_ticket.ps1         Script client (pipeline MCP/Jira)
├── video-scripts/         Scripts des vidéos de démonstration
├── context_projet.md      Fiche technique détaillée
└── .env.example           Modèle de variables d'environnement
```

> Fiche complète du projet : [`PROJET_AGENTS_IA_Version_Finale_3.md`](PROJET_AGENTS_IA_Version_Finale_3.md)
> · Architecture & stack : [`context_projet.md`](context_projet.md)
