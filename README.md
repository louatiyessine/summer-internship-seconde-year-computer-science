# Summer Internship — Seconde Year Computer Science

Dépôt regroupant le travail réalisé pendant mon **stage d'été (2ᵉ année Bachelor Informatique)**,
centré sur l'**Intelligence Artificielle agentique** : agents IA, RAG, protocole MCP et
automatisation de workflows avec n8n.

**Auteur :** Yessine Louati

---

## Contenu du dépôt

```
.
├── ai-agent/          Application web multi-agents (Flask) : Gemini+RAG, Llama local, agent Jira, MCP
├── jira-pipeline/     Frontend Angular du pipeline Jira
├── n8n/               Automatisations n8n (météo, agent multi-outils + RAG, MCP) + LangGraph
├── videos/            Vidéos de démonstration (locales, non versionnées — voir videos/VIDEOS.md)
└── README.md
```

---

## 1. `ai-agent/` — Application web multi-agents

Application **Flask** réunissant trois agents et une interface de chat à quatre modes.

- **Agent 1 — Gemini 2.5 Flash + RAG** : répond à partir des documents de l'entreprise
  fictive *TechNova*, indexés dans une base vectorielle **ChromaDB**.
- **Agent 2 — Llama 3.2 (local via Ollama, sans RAG)** : sert de comparaison.
- **Agent 3 — Jira** : lit un ticket via l'API REST Atlassian, détecte l'intention et
  transmet un prompt à l'Agent 1 ou 2.
- **Intégration MCP** (Model Context Protocol) : résolution de tickets en deux temps
  (*plan* puis *execute*), avec commit/push Git.

Modes d'interface : chat simple · comparaison des deux agents (tokens + coût $) ·
dialogue entre agents · agent Jira.

**Lancer :** créer un `.env` à partir de `ai-agent/.env.example`, installer
`requirements.txt`, puis `python app.py` (voir la fiche `ai-agent/context_projet.md`).

## 2. `jira-pipeline/` — Frontend Angular

Interface Angular (v21) accompagnant le pipeline Jira. Source dans `src/`.
`npm install` puis `ng serve` (http://localhost:4200).

## 3. `n8n/` — Automatisations & IA agentique

- **phase-1-meteo/** : bulletin météo quotidien automatisé (OpenWeatherMap → Gmail).
- **phase-2-rag-tools/** : agent IA multi-outils local (calcul, météo, RAG) avec Ollama.
- **phase-3-mcp/** : même agent où les outils sont remplacés par des serveurs MCP.
- **langgraph/** : agent ReAct construit avec LangGraph (notebook).
- **workflow-to-python/** : conversions des workflows en Python.

Chaque phase contient son workflow `.json` (importable dans n8n) et sa fiche `.md`.
Vue d'ensemble : `n8n/RECAP_conversation_complete.md`. Démarrage : `n8n/DEMARRAGE_agent.txt`.

## 4. `videos/`

Vidéos de démonstration. Trop volumineuses pour GitHub (> 100 Mo), elles restent
**locales** et ne sont pas versionnées. Description et scripts : `videos/VIDEOS.md`.

---

## Stack technique

Python · Flask · LangChain / LangGraph · Gemini · Llama & Qwen (Ollama) · ChromaDB ·
MCP · n8n · Angular / TypeScript · API Jira, OpenWeatherMap, Gmail · Git.

## Sécurité

Les fichiers `.env` (clés API) et les artefacts lourds (`venv/`, `node_modules/`,
`dist/`, base vectorielle, vidéos) sont exclus via `.gitignore`. Utilisez les fichiers
`.env.example` comme modèles.
