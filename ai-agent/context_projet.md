# Contexte du projet — Agents IA TechNova (Stage)

## Stack technique
- **Backend** : Python, Flask, LangChain
- **Agent 1** : Gemini 2.5 Flash (API Google) + RAG (ChromaDB + embeddings gemini-embedding-001)
- **Agent 2** : Llama 3.2 via Ollama (local, gratuit, sans clé)
- **Agent 3** : Agent Jira (lit tickets via API REST Atlassian, détecte l'intention, envoie un prompt à Agent 1 ou 2)
- **Frontend** : HTML/CSS/JS natif, thème sombre/vert, marked.js pour le rendu Markdown

## Structure des fichiers
```
ai agent/
├── app.py                        # Serveur Flask, orchestrateur principal
├── .env                          # Clés API (jamais committé)
├── requirements.txt
├── agents/
│   ├── agent_gemini.py           # Agent 1 : Gemini + RAG
│   ├── agent_llama.py            # Agent 2 : Llama via Ollama
│   ├── agent_jira.py             # Agent 3 : lit ticket Jira, construit prompt, envoie à agent 1 ou 2
│   └── dialogue.py               # Dialogue agent-à-agent
├── rag/
│   ├── rag_engine.py             # Chargement docs, chunking, embeddings, ChromaDB
│   └── documents/                # Fichiers source (.pdf, .txt)
├── utils/
│   ├── cost_calculator.py        # Calcul tokens → coût en dollars
│   └── agent_client.py           # Fonction appeler_agent_interne() — appel HTTP + clé API
└── static/
    └── index.html                # Interface chatbot (4 modes)
```

## Variables .env nécessaires
```
GOOGLE_API_KEY=...
JIRA_DOMAIN=louatiyessine70-1782306084217.atlassian.net
JIRA_EMAIL=...
JIRA_API_TOKEN=...
AGENT1_API_KEY=...
AGENT2_API_KEY=...
```

## Routes Flask (app.py)
| Route | Méthode | Rôle |
|---|---|---|
| `/` | GET | Sert index.html |
| `/api/chat` | POST | Interroge Agent 1 ou 2 via `appeler_agent_interne()` |
| `/api/agent1/chat` | POST | **Point d'exécution réel** Agent 1, exige X-API-Key header |
| `/api/agent2/chat` | POST | **Point d'exécution réel** Agent 2, exige X-API-Key header |
| `/api/compare` | POST | Les deux agents sur la même question, rapport coût/tokens |
| `/api/dialogue` | POST | Dialogue agent-à-agent multi-tours |
| `/api/jira` | POST | Traitement ticket Jira → prompt → agent cible |
| `/api/upload` | POST | Upload PDF/TXT → ajout à la base RAG |

## Architecture de sécurité
- Chaque agent a sa propre clé API (`AGENT1_API_KEY`, `AGENT2_API_KEY`)
- Toutes les routes "interface" (`/api/chat`, `/api/compare`, `/api/dialogue`) passent par `appeler_agent_interne()` qui fait une vraie requête HTTP avec la clé
- Les routes `/api/agent1/chat` et `/api/agent2/chat` sont les **points terminaux réels** — elles appellent directement `repondre_avec_rag()` / `repondre_sans_rag()` pour éviter une boucle infinie
- L'Agent Jira utilise aussi `appeler_agent_interne()` avec la bonne clé

## Interface (4 modes)
1. **Demander à un agent** — chat simple avec choix Gemini ou Llama
2. **Comparer les deux agents** — même question, deux réponses + tokens + coût affiché
3. **Dialogue entre agents** — les deux agents se répondent sur plusieurs tours
4. **Agent Jira** — saisir une clé de ticket (ex: SCRUM-1), choisir l'agent destinataire

## Ce qui reste à faire (tâches du jour)
1. Améliorer le prompt de l'Agent Jira (ton "ingénieur senior", réponse structurée)
2. Intégrer MCP dans le projet
3. Mettre à jour la documentation MD finale

## Dépôt GitHub
https://github.com/louatiyessine/ai-agents_jira
