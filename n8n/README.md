# n8n — Automatisations & IA agentique

Projets d'automatisation réalisés avec **n8n** (workflows) et **Ollama** (modèles locaux),
du plus simple au plus avancé.

## Contenu

| Dossier / fichier | Contenu |
|---|---|
| `phase-1-meteo/` | Bulletin météo quotidien automatisé (OpenWeatherMap → Gmail) |
| `phase-2-rag-tools/` | Agent IA multi-outils local (calcul, météo, **RAG**) avec Ollama |
| `phase-3-mcp/` | Même agent où les outils sont remplacés par des serveurs **MCP** |
| `langgraph/` | Agent ReAct construit avec **LangGraph** (notebook) |
| `workflow-to-python/` | Conversions des workflows en Python |
| `documents/` | Documents de test pour le RAG |
| `n8n_theorie_cours.pdf` | Cours théorique n8n |

Chaque phase contient son workflow `.json` (importable dans n8n via *Import from File*)
et sa fiche `.md`.

## Démarrage rapide

Voir [`DEMARRAGE_agent.txt`](DEMARRAGE_agent.txt). En résumé, à chaque session :

1. Ouvrir **Ollama** (modèles `qwen3:4b` et `nomic-embed-text`).
2. Lancer **n8n** → http://localhost:5678
3. (Phase 3) Démarrer les serveurs MCP (voir la fiche de la phase).
4. Relancer l'ingestion RAG (la base vectorielle en mémoire se vide au redémarrage).

> Vue d'ensemble complète : [`RECAP_conversation_complete.md`](RECAP_conversation_complete.md)
