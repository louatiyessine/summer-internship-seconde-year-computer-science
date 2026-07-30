# Projet 2 — Agent IA multi-outils (local) avec RAG

**Outil :** n8n (self-hosted) + Ollama (local) · **Statut :** fonctionnel · **100% local & privé**

---

## 1. Objectif
Construire un **agent IA conversationnel** qui tourne **entièrement en local** (aucune donnée sur internet), capable de **raisonner**, d'**utiliser plusieurs outils** (calculs, météo, recherche documentaire) et de **répondre à partir de documents privés** (RAG).

## 2. Architecture

**Partie A — Ingestion des documents (RAG) :**
```
[Manual Trigger] → [Read Files] → [Simple Vector Store: INSERT]
                                        ├─ Embeddings Ollama (nomic-embed-text)
                                        └─ Default Data Loader (découpage du texte)
```

**Partie B — L'agent conversationnel :**
```
              [Chat Trigger]
                    │
              ┌─────▼─────┐
              │ AI  AGENT │  (raisonne, choisit les outils)
              └─────┬─────┘
     ┌──────────────┼───────────────────────────┐
     ▼              ▼                            ▼
[Chat Model]     [Memory]                    [ OUTILS ]
Ollama Qwen3   Window Buffer      ┌─────────────────────────────────┐
(thinking 🧠)  (mémoire convo)    │ addition / soustraction / mult.  │  (Code Tools)
                                  │ météo (HTTP → OpenWeatherMap)     │
                                  │ recherche_documents (RAG)        │
                                  │    └─ Vector Store + Embeddings   │
                                  └─────────────────────────────────┘
```

## 3. Rôle des composants
| Composant | Rôle |
|-----------|------|
| **Chat Trigger** | Reçoit le message de l'utilisateur, démarre l'agent. |
| **AI Agent** | Le « cerveau » : raisonne, décide quel(s) outil(s) appeler, rédige la réponse. |
| **Ollama Qwen3** | Le modèle (LLM) en local, avec mode *thinking* (raisonnement visible). |
| **Simple Memory** | Mémorise la conversation (permet les questions de suivi). |
| **Outils maths** | Fonctions addition, soustraction, multiplication (Code Tools JavaScript). |
| **Outil météo** | Appelle l'API OpenWeatherMap ; la ville est fournie par l'agent via `$fromAI`. |
| **recherche_documents** | Recherche sémantique dans les documents (RAG). |
| **Embeddings + Vector Store** | Encodent et stockent les documents pour la recherche par sens. |

## 4. Détails techniques
- **Modèle de raisonnement :** Qwen3 (via Ollama, local) — supporte *tools* + *thinking*.
- **Modèle d'embeddings :** nomic-embed-text (via Ollama).
- **Base vectorielle :** Simple Vector Store (in-memory).
- **RAG :** documents lus → découpés → encodés (embeddings) → stockés → recherche par similarité.
- **Connexion Ollama :** `http://127.0.0.1:11434` (IPv4).
- **Confidentialité :** tout s'exécute en local, aucune donnée envoyée vers un service externe.

## 5. Concepts clés
Agent IA (pattern *reason + act*), function calling (outils), JSON, expressions `$fromAI`, embeddings, base vectorielle, **RAG** (Retrieval-Augmented Generation), mémoire conversationnelle.
