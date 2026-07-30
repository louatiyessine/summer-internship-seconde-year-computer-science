<h1 align="center">Summer Internship — Second Year Computer Science</h1>

<p align="center">
  <em>Travail réalisé pendant mon stage d'été (2ᵉ année Bachelor Informatique)<br>
  centré sur l'Intelligence Artificielle agentique : agents IA, RAG, MCP et automatisation n8n.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask">
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white" alt="LangChain">
  <img src="https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white" alt="Ollama">
  <img src="https://img.shields.io/badge/n8n-EA4B71?style=flat-square&logo=n8n&logoColor=white" alt="n8n">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git">
</p>

<p align="center">
  <strong>Auteur :</strong> Yessine Louati
</p>

---

## Table des matières

- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Structure du dépôt](#structure-du-dépôt)
- [1. ai-agent — Application multi-agents](#1-ai-agent--application-web-multi-agents)
- [2. jira-pipeline — Frontend Angular](#2-jira-pipeline--frontend-angular)
- [3. n8n — Automatisations & IA agentique](#3-n8n--automatisations--ia-agentique)
- [4. videos — Démonstrations](#4-videos--démonstrations)
- [Stack technique](#stack-technique)
- [Sécurité](#sécurité)

---

## Aperçu

Ce dépôt regroupe, de façon progressive, l'ensemble des projets construits durant le stage —
des fondations d'un agent IA jusqu'à des architectures avancées mêlant plusieurs agents, la
technique **RAG**, le protocole **MCP** et l'automatisation de bout en bout avec **n8n**.

## Architecture

Vue d'ensemble du projet phare — l'application multi-agents `ai-agent` :

```mermaid
flowchart TD
    U["Utilisateur"] --> UI["Interface de chat<br/>4 modes"]
    UI --> F["Serveur Flask<br/>orchestrateur / API REST"]

    F --> A1["Agent 1<br/>Gemini + RAG"]
    F --> A2["Agent 2<br/>Llama - Ollama, local"]
    F --> A3["Agent 3<br/>Jira"]

    A1 --> RAG[("ChromaDB<br/>base vectorielle")]
    RAG --> DOCS["Documents TechNova"]
    A3 --> JIRA["API REST Jira / Atlassian"]

    F --> COST["Calcul tokens -> cout $"]
    F --> MCP["Serveur MCP<br/>outils: fichiers, Jira"]
    MCP -.plan puis execute.-> GIT["Commit / Push Git"]

    classDef core fill:#1E4D2B,stroke:#14361E,color:#fff;
    classDef agent fill:#6FA85C,stroke:#2C5F2D,color:#fff;
    classDef ext fill:#EAF1E4,stroke:#6FA85C,color:#1E4D2B;
    class F,UI core;
    class A1,A2,A3 agent;
    class RAG,DOCS,JIRA,COST,MCP,GIT ext;
```

## Structure du dépôt

```
.
├── ai-agent/          Application web multi-agents (Flask) : Gemini+RAG, Llama local, agent Jira, MCP
├── jira-pipeline/     Frontend Angular du pipeline Jira
├── n8n/               Automatisations n8n (météo, agent multi-outils + RAG, MCP) + LangGraph
├── videos/            Vidéos de démonstration (locales, non versionnées — voir videos/VIDEOS.md)
└── README.md
```

---

## 1. `ai-agent` — Application web multi-agents

Application **Flask** réunissant trois agents et une interface de chat à quatre modes.

| Agent | Modèle | Rôle |
|---|---|---|
| **Agent 1** | Gemini 2.5 Flash + **RAG** | Répond à partir des documents *TechNova* (base vectorielle ChromaDB) |
| **Agent 2** | Llama 3.2 (local, Ollama) | Sans RAG — sert de comparaison |
| **Agent 3** | Jira | Lit un ticket via l'API REST Atlassian, détecte l'intention, délègue à l'agent 1 ou 2 |

Intégration **MCP** (Model Context Protocol) : résolution de tickets en deux temps
(*plan* → *execute*) avec commit/push Git. Modes d'interface : chat simple · comparaison des
deux agents (tokens + coût $) · dialogue entre agents · agent Jira.

> Détails et démarrage : [`ai-agent/README.md`](ai-agent/README.md)

## 2. `jira-pipeline` — Frontend Angular

Interface **Angular 21** accompagnant le pipeline Jira.

> Détails et démarrage : [`jira-pipeline/README.md`](jira-pipeline/README.md)

## 3. `n8n` — Automatisations & IA agentique

| Dossier | Contenu |
|---|---|
| `phase-1-meteo/` | Bulletin météo quotidien automatisé (OpenWeatherMap → Gmail) |
| `phase-2-rag-tools/` | Agent IA multi-outils local (calcul, météo, RAG) avec Ollama |
| `phase-3-mcp/` | Même agent où les outils sont remplacés par des serveurs MCP |
| `langgraph/` | Agent ReAct construit avec LangGraph (notebook) |
| `workflow-to-python/` | Conversions des workflows en Python |

Chaque phase contient son workflow `.json` (importable dans n8n) et sa fiche `.md`.

> Détails et démarrage : [`n8n/README.md`](n8n/README.md)

## 4. `videos` — Démonstrations

Vidéos de démonstration. Trop volumineuses pour GitHub (> 100 Mo), elles restent **locales**
et ne sont pas versionnées. Description et scripts : [`videos/VIDEOS.md`](videos/VIDEOS.md).

---

## Stack technique

**Langages** : Python · TypeScript · JavaScript
**IA** : LangChain · LangGraph · Gemini · Llama & Qwen (Ollama) · ChromaDB (RAG) · MCP
**Backend / Frontend** : Flask · Angular
**Automatisation & intégrations** : n8n · API Jira · OpenWeatherMap · Gmail · Git

## Sécurité

Les fichiers `.env` (clés API) et les artefacts lourds (`venv/`, `node_modules/`, `dist/`,
base vectorielle, vidéos) sont exclus via `.gitignore`. Utilisez les fichiers `.env.example`
comme modèles.
