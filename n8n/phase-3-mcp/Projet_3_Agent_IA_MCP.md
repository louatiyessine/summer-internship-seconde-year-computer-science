# Projet 3 — Agent IA avec serveurs MCP

**Outil :** n8n + Ollama + serveurs MCP · **Statut :** fonctionnel · **Évolution du Projet 2**

---

## 1. Objectif
Faire évoluer l'agent du Projet 2 en **remplaçant les outils codés à la main par des outils fournis par des serveurs MCP** (Model Context Protocol). Objectif : montrer comment un agent utilise des outils **standardisés et réutilisables**, sans les recoder.

## 2. Qu'est-ce que le MCP ?
Le **MCP (Model Context Protocol)** est un standard qui permet de brancher des **outils et des données** à une IA de façon universelle. Un **serveur MCP** expose des outils ; n8n (le **client MCP**) s'y connecte et les met à disposition de l'agent.

## 3. Architecture
```
              [Chat Trigger]
                    │
              ┌─────▼─────┐
              │ AI  AGENT │
              └─────┬─────┘
     ┌──────────────┼──────────────────────────────┐
     ▼              ▼                               ▼
[Ollama Qwen3]  [Memory]                        [ OUTILS ]
                            ┌──────────────────────────────────────────┐
                            │ météo (HTTP → OpenWeatherMap)             │
                            │ recherche_documents (RAG)                 │
                            │ MCP_Everything   ── serveur MCP (add…)    │  ◄── NOUVEAU
                            │ MCP_Filesystem   ── serveur MCP (fichiers)│  ◄── NOUVEAU
                            └──────────────────────────────────────────┘

Serveurs MCP (lancés en local) :
  • server-everything  →  http://localhost:3001/mcp   (HTTP Streamable)
  • filesystem (via supergateway) → http://127.0.0.1:8000/mcp  (HTTP Streamable)
```

## 4. Rôle des composants MCP
| Composant | Rôle |
|-----------|------|
| **MCP Client (node n8n)** | Se connecte à un serveur MCP et importe tous ses outils dans l'agent. |
| **MCP_Everything** | Serveur MCP officiel de test (outils `add`, `echo`…) → remplace les outils maths. |
| **MCP_Filesystem** | Serveur MCP filesystem → lire/écrire des fichiers (accès limité au dossier `.n8n-files`). |
| **supergateway** | Pont qui convertit un serveur MCP **STDIO** en **HTTP** (n8n a besoin d'une URL). |

## 5. Détails techniques
- **Transports MCP :** SSE (1 connexion) vs **HTTP Streamable** (multi-connexions, recommandé et utilisé ici).
- **Pont :** `supergateway --stdio "..." --outputTransport streamableHttp` (le serveur filesystem ne parle qu'en STDIO).
- **Sécurité :** le serveur filesystem est limité au dossier `C:\Users\Admin\.n8n-files`.
- **Base :** l'agent conserve la météo et le RAG du Projet 2.

## 6. Démonstration clé (custom → MCP)
> « Avant, chaque outil était codé à la main (Code Tool). Maintenant, je branche un **serveur MCP** via le **MCP Client**, et l'agent récupère automatiquement ses outils, au format standardisé et réutilisable. »

## 7. Concepts clés
MCP (client/serveur), transports (STDIO, SSE, HTTP Streamable), pont STDIO→HTTP (supergateway), outils standardisés vs outils codés, sécurité par restriction de dossier.
