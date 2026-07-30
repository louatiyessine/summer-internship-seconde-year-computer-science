# Récapitulatif complet — Stage n8n / IA (document de passation)

> Ce document résume tout ce qui a été fait dans la session, pour qu'une autre session puisse reprendre le contexte.

---

## 1. Contexte

- **Personne :** Yessine, stagiaire (2e année bachelor informatique).
- **Encadrant :** lui a demandé d'apprendre n8n (interface graphique + vocabulaire), puis de réaliser plusieurs projets.
- **Objectif global :** comprendre n8n et l'IA agentique en local, savoir tout expliquer (l'encadrant pose des questions sur chaque détail).
- **Langue de travail :** français / anglais mélangés.

---

## 2. Environnement technique

- **n8n :** installé en local via `npm install -g n8n`, lancé avec la commande `n8n`, accessible sur `http://localhost:5678`.
- **Ollama :** installé en local, tourne sur `http://127.0.0.1:11434` (⚠️ utiliser `127.0.0.1` et PAS `localhost` — sinon erreur IPv6 `::1` ECONNREFUSED).
- **Modèles Ollama :**
  - `qwen3:4b` → modèle de raisonnement (LLM), supporte *tools* + *thinking*.
  - `nomic-embed-text:latest` → modèle d'embeddings (encode le texte en vecteurs).
- **Dossier de travail :** `C:\licence informatique\summer internship 2eme bachlor\22-07`
- **Dossier autorisé pour n8n (lecture fichiers) :** `C:\Users\Admin\.n8n-files` (n8n restreint l'accès disque à ce dossier par défaut).

---

## 3. Projet 1 — Automatisation météo (n8n Cloud)

Workflow déployé et actif : chaque jour à 8h, envoi d'un email météo de Sfax.

`Schedule Trigger (8h) → HTTP Request (OpenWeatherMap, lat=34.7406 lon=10.7603) → Edit Fields (extraire) → IF (pluie ?) → 2× Gmail (parapluie / normal)`

- API OpenWeatherMap (clé API dans `appid`), `units=metric`, `lang=fr`.
- Email Gmail via OAuth2, expressions `{{ $json.champ }}`.

---

## 4. Projet 2 — Agent IA multi-outils + RAG (local)

Workflow **"Agent IA Multi-Tools"**. Agent conversationnel 100% local.

**Structure :**
```
Chat Trigger → AI Agent
   ├─ Chat Model : Ollama qwen3:4b
   ├─ Memory : Simple Memory
   └─ Tools :
        ├─ addition / soustraction / multiplication  (Code Tools JS)
        │     Name = Fixed, Input Schema {a,b}, code: return String(query.a + query.b)
        ├─ meteo (HTTP Request tool, ville via {{ $fromAI('ville') }})
        └─ recherche_documents (Simple Vector Store, mode "Retrieve as Tool for AI Agent")
```

**Ingestion RAG (chaîne séparée) :**
```
Manual Trigger → Read Files (C:\Users\Admin\.n8n-files\*.txt)
   → Simple Vector Store (Insert Documents, Memory Key = docs_projet)
        ├─ Embeddings Ollama (nomic-embed-text)
        └─ Default Data Loader (Type: Binary, Text Splitting: Simple)
```

**Points clés :**
- La base vectorielle est **in-memory** (Simple Vector Store) → se vide au redémarrage de n8n. Il faut **relancer l'ingestion** à chaque session.
- Les deux Simple Vector Store (Insert et Retrieve) sont reliés **par le même Memory Key `docs_projet`**, pas par un fil.
- L'embedding doit être **le même** (nomic-embed-text) à l'ingestion ET à la recherche.

**Documents de test (dans `.n8n-files`) :**
- `projet_alpha_calculs.txt` → contient des équations (budget, licences) → teste RAG + maths.
- `fiche_technosfax.txt` → infos entreprise fictive → teste RAG factuel.

---

## 5. Projet 3 — Agent IA avec serveurs MCP

Workflow **"Agent IA MCP"** = copie du Projet 2, où les 3 tools maths sont remplacés par des serveurs MCP.

**Nouveaux tools (via node MCP Client) :**
- `MCP_Everything` → serveur `server-everything` (outils `add`, `echo`…), transport HTTP Streamable, endpoint `http://localhost:3001/mcp`.
- `MCP_Filesystem` → serveur filesystem (lire/écrire fichiers), via **supergateway** (pont STDIO→HTTP), endpoint `http://127.0.0.1:8000/mcp`.

**Commandes des serveurs MCP :**
```
npx -y @modelcontextprotocol/server-everything streamableHttp
npx -y supergateway --stdio "npx -y @modelcontextprotocol/server-filesystem C:\Users\Admin\.n8n-files" --outputTransport streamableHttp
```

**Points clés (appris en debug) :**
- Le node MCP Client de n8n se connecte par **URL** (HTTP Streamable ou SSE), pas par commande STDIO.
- **SSE = 1 seule connexion** (crash "Already connected to a transport") → préférer **HTTP Streamable** (multi-connexions).
- Le serveur filesystem est STDIO only → il faut **supergateway** pour l'exposer en HTTP.
- Toujours vérifier l'endpoint (`/mcp` vs `/sse`) et `127.0.0.1` vs `localhost`.

---

## 6. Procédure de démarrage (à chaque reboot)

1. Ouvrir l'app **Ollama**.
2. Terminal : `n8n` → ouvrir `http://localhost:5678`.
3. Terminal : `npx -y @modelcontextprotocol/server-everything streamableHttp`
4. Terminal : `npx -y supergateway --stdio "npx -y @modelcontextprotocol/server-filesystem C:\Users\Admin\.n8n-files" --outputTransport streamableHttp`
5. Dans n8n : relancer l'ingestion RAG (▶️ sur le Manual Trigger) — sinon la base est vide.

---

## 7. Fichiers créés dans le dossier de travail

- `n8n_theorie_cours.pdf` — cours théorique n8n (5 leçons + Q/R).
- `Projet_1_Meteo.md`, `Projet_2_Agent_IA_Tools_RAG.md`, `Projet_3_Agent_IA_MCP.md` — fiches projet.
- `DEMARRAGE_agent.txt` — checklist de démarrage.
- `projet_alpha_calculs.txt`, `fiche_technosfax.txt` (dans `.n8n-files`) — docs de test RAG.

---

## 8. En cours actuellement — démo des 4 Operation Modes

L'agent utilise 2 des 4 modes du Simple Vector Store. Démo des 2 autres pour l'encadrant :

- **Get Many** → ✅ fait (workflow "Demo Vector Store"). Cherche directement dans la base et renvoie les morceaux + score de similarité. A révélé des **doublons** (ingestion relancée plusieurs fois → le in-memory ne dédoublonne pas).
- **Retrieve as Vector Store for Chain/Tool** → 🔧 en cours (workflow "My workflow 2").
  ```
  Chat Trigger → Question and Answer Chain
       ├─ Model : Ollama qwen3
       └─ Retriever : Vector Store Retriever
                        └─ Simple Vector Store (As Vector Store for Chain/Tool, docs_projet)
                                 └─ Embeddings Ollama (nomic-embed-text)
  ```
  **Erreur rencontrée :** `Cannot read properties of undefined (reading 'asRetriever')`.
  **Cause probable :** la base `docs_projet` est vide dans la session (n8n redémarré) → le retriever reçoit `undefined`.
  **Solution en cours de test :** relancer l'ingestion (Insert) dans la session, sans redémarrer n8n, puis re-tester.

**Les 4 modes (résumé) :** Insert = écrire · Get Many = chercher à la main · As Vector Store for Chain = brancher sur une chaîne QA · As Tool for AI Agent = donner à l'agent.

---

## 9. Concepts maîtrisés

n8n (workflow, node, trigger, expressions `{{ }}`), API/JSON, IF/logique, credentials, agents IA (reason+act), function calling (tools), memory, embeddings, base vectorielle, **RAG**, **MCP** (client/serveur, transports STDIO/SSE/HTTP Streamable, supergateway).

---

## 10. Prochaines étapes

- Finir la démo du mode "As Vector Store for Chain" (résoudre l'erreur asRetriever).
- Préparer/réviser la présentation à l'encadrant (reconstruction live de l'agent + erreurs-pièges volontaires).
- Regarder 3 vidéos LangChain/LangGraph recommandées.
