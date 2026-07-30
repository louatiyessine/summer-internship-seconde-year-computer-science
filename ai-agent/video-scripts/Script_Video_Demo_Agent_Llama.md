# 🎬 Script Vidéo — Démonstration d'un agent IA (Llama, en local) (~8 min)

> Texte normal = ce que tu **DIS**. Blocs `[ ]` = ce que tu **MONTRES**.
> À préparer AVANT de filmer : Ollama installé et lancé, le modèle `llama3.2` téléchargé, VS Code ouvert sur `agents/agent_llama.py`, un terminal prêt. (Voir Annexe A — teste tout une fois avant !)

---

## 1 — Intro (0:00 – 0:45)

`[CAMÉRA]`

Bonjour à tout le monde ! Vous connaissez tous ChatGPT. Mais est-ce que vous saviez qu'on peut faire tourner une **intelligence artificielle directement sur son propre ordinateur** — **gratuitement**, et même **sans Internet** ?

Aujourd'hui, je vais vous montrer un vrai **agent IA** que j'ai codé, qui répond à mes questions, 100% en local. Et on va regarder le code ensemble, ligne par ligne. C'est parti !

`[INCRUSTATION : « Démo — un agent IA en local avec Llama »]`

---

## 2 — Llama & Ollama, c'est quoi ? (0:45 – 1:45)

`[CAMÉRA]`

Deux mots à connaître avant de commencer.

`[INCRUSTATION : « Llama = le cerveau · Ollama = le moteur »]`

**Llama**, c'est un **modèle d'intelligence artificielle**, un peu comme celui derrière ChatGPT. Mais lui, il est **ouvert et gratuit** : il est développé par Meta, et n'importe qui peut l'utiliser.

**Ollama**, c'est l'**outil** qui permet de faire tourner ce modèle **sur ma propre machine**. C'est lui le moteur.

Donc : Llama, c'est le **cerveau**. Ollama, c'est le **moteur** qui fait tourner ce cerveau chez moi. Et comme tout est sur mon ordinateur, c'est **gratuit** et **privé** : mes questions ne partent nulle part.

---

## 3 — Le code de l'agent (1:45 – 4:00)

`[ÉCRAN — VS Code : ouvrir agents/agent_llama.py]`

Voici le code de mon agent. Il est plus court que ce que vous imaginez ! Regardons-le ensemble.

`[ÉCRAN — surligner les 2 premières lignes]`
```python
import ollama
MODEL_NAME = "llama3.2"
```

D'abord, j'importe **ollama**, notre moteur. Et je choisis le modèle : **llama3.2**.

`[ÉCRAN — surligner la fonction repondre_sans_rag]`
```python
def repondre_sans_rag(question):
    reponse = ollama.chat(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": question}]
    )
```

Ici, je crée une fonction : `repondre_sans_rag`. Elle prend une **question**, et elle la donne au modèle avec `ollama.chat`.

`[ÉCRAN — pointer messages / role / content]`

Cette partie, c'est simplement la façon de parler à l'IA : je dis « l'**utilisateur** (`user`) a écrit **ce contenu** (`content`) » — c'est-à-dire ma question.

`[ÉCRAN — surligner le bloc try / except]`

Et vous voyez ce `try` et ce `except` ? C'est une **sécurité**. Si jamais Ollama n'est pas lancé, le programme ne plante pas : il affiche un message clair qui dit « le service Llama est indisponible ». C'est important dans un vrai projet.

`[ÉCRAN — surligner le return]`
```python
return {
    "reponse": reponse["message"]["content"],
    "tokens_entree": tokens_entree,
    "tokens_sortie": tokens_sortie,
    "tokens_total": tokens_entree + tokens_sortie,
}
```

Enfin, je récupère la **réponse** de l'IA, et je renvoie aussi des chiffres qu'on appelle des **tokens**. Justement, parlons-en.

---

## 4 — C'est quoi un token ? (4:00 – 5:00)

`[CAMÉRA]`

`[INCRUSTATION : « Un token ≈ un petit morceau de mot »]`

Une IA ne lit pas les mots comme nous. Elle les découpe en petits morceaux qu'on appelle des **tokens**. Un token, c'est environ **un petit bout de mot**.

Et mon agent compte deux choses :

`[INCRUSTATION — 2 lignes]`

Les **tokens d'entrée** : la taille de ma **question**.

Les **tokens de sortie** : la taille de la **réponse** de l'IA.

Pourquoi c'est utile ? Parce que dans les IA payantes, comme celles dans le cloud, **on paie au token**. Plus il y a de tokens, plus ça coûte. Ici, comme tout est en local, c'est… **zéro dinar** ! Mais c'est une très bonne habitude de les mesurer.

---

## 5 — On lance l'agent ! (5:00 – 6:45)

`[ÉCRAN — VS Code, montrer le bloc de test en bas du fichier]`

En bas du fichier, j'ai préparé une **question de test**.

`[ÉCRAN — surligner la question_test]`
```python
question_test = "Explique en 2 phrases simples ce qu'est l'intelligence artificielle."
```

`[ÉCRAN — terminal : lancer la commande]`
```bash
python agent_llama.py
```

Je lance mon agent…

`[ÉCRAN — attendre la réponse, ZOOM sur le résultat dans le terminal]`

Et voilà ! L'IA me répond, **directement depuis mon ordinateur**. Regardez : la question, puis la **réponse** générée par Llama, et en bas les **statistiques de tokens** : entrée, sortie, total.

`[CAMÉRA]`

Ce qui est magique, c'est que pendant cette réponse, **je n'ai utilisé aucun site, aucune clé, aucun Internet**. Tout s'est passé ici.

`[ÉCRAN — changer la question dans le code, relancer]`

Essayons une autre question. Je change pour : « Donne-moi 3 idées de prénoms pour un chat. » Je relance…

`[ÉCRAN — ZOOM sur la nouvelle réponse]`

Et l'agent répond à nouveau. Mon petit assistant fonctionne parfaitement !

---

## 6 — Pourquoi c'est puissant (6:45 – 7:30)

`[CAMÉRA]`

Résumons pourquoi ce type d'agent est intéressant.

`[INCRUSTATION — 3 points]`

Il est **gratuit** : aucun abonnement, aucune clé à payer.

Il est **privé** : mes données restent sur ma machine, elles ne partent chez personne.

Et il fonctionne **hors ligne** : même sans Internet, il répond.

C'est exactement le genre d'agent qu'on peut intégrer dans un vrai projet quand on veut garder le contrôle et les coûts à zéro.

---

## 7 — Conclusion + teaser (7:30 – 8:15)

`[CAMÉRA]`

`[INCRUSTATION — résumé]`

Aujourd'hui, on a vu un vrai **agent IA** : **Llama** le cerveau, **Ollama** le moteur, une petite fonction qui pose la question et récupère la réponse, et les **tokens** pour mesurer tout ça.

`[CAMÉRA]`

Mais cet agent a une limite : il ne connaît que ses **connaissances générales**. Si je lui demande une info précise sur **mon entreprise**, il ne saura pas répondre.

Dans une prochaine vidéo, je vous montrerai comment lui **donner nos propres documents** pour qu'il réponde sur **nos** données — c'est ce qu'on appelle le **RAG**. Ça va être passionnant !

Partagez si ça vous a plu, et à très vite, inchaAllah ! 👋

`[INCRUSTATION : « Prochaine fois : donner sa mémoire à l'IA (le RAG) »]`

---

# 📎 Annexe A — Prérequis à préparer AVANT de filmer

1. **Installer Ollama** : télécharger depuis `https://ollama.com` et installer.
2. **Télécharger le modèle** (une seule fois, ça prend quelques minutes) :
   ```bash
   ollama pull llama3.2
   ```
3. **Vérifier qu'Ollama tourne** : normalement il démarre tout seul. Pour tester :
   ```bash
   ollama run llama3.2
   ```
   (écris « bonjour », vérifie qu'il répond, puis quitte avec `/bye`).
4. **Se placer dans le bon dossier** avant de lancer le script :
   ```bash
   cd "ai agent/agents"
   python agent_llama.py
   ```

> ⚠️ Le plus important : **teste toute la démo une fois avant d'enregistrer**. La première réponse de Llama peut être un peu lente (le modèle se charge en mémoire). Lance-le une fois « à blanc » juste avant de filmer.

---

# 📎 Annexe B — Le code `agent_llama.py` (ton vrai code)

```python
import ollama

MODEL_NAME = "llama3.2"

def repondre_sans_rag(question):
    try:
        reponse = ollama.chat(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": question}]
        )
    except Exception as erreur:
        print(f"[agent_llama] Erreur Ollama : {erreur}")
        return {
            "reponse": "Le service Llama (Ollama) est indisponible. Vérifiez qu'Ollama tourne bien sur votre machine.",
            "tokens_entree": 0, "tokens_sortie": 0, "tokens_total": 0,
        }

    tokens_entree = reponse["prompt_eval_count"]
    tokens_sortie = reponse["eval_count"]

    return {
        "reponse": reponse["message"]["content"],
        "tokens_entree": tokens_entree,
        "tokens_sortie": tokens_sortie,
        "tokens_total": tokens_entree + tokens_sortie,
    }

if __name__ == "__main__":
    question_test = "Explique en 2 phrases simples ce qu'est l'intelligence artificielle."
    resultat = repondre_sans_rag(question_test)

    print("QUESTION :", question_test)
    print("\nRÉPONSE :", resultat["reponse"])
    print("\n--- Statistiques tokens ---")
    print("Tokens entrée :", resultat["tokens_entree"])
    print("Tokens sortie :", resultat["tokens_sortie"])
    print("Tokens total :", resultat["tokens_total"])
```

> 💡 Pour la vidéo, j'ai remplacé la question de test par une **question générale** (« qu'est-ce que l'IA »), que Llama gère très bien seul. La question d'origine (« combien de jours de congés ») est parfaite pour la vidéo sur le **RAG**, car elle a besoin de tes documents pour être résolue.

---

# 📎 Annexe C — Idées bonus (l'encadrant appréciera)

- **Montrer le cas d'erreur en vrai :** ferme Ollama, relance le script → l'agent affiche le message « service indisponible » au lieu de planter. Ça met en valeur ton `try/except` et le côté « code robuste ».
- **Faire une mini-comparaison de vitesse :** pose une question courte puis une longue, et montre que le nombre de **tokens de sortie** augmente. Ça rend la notion de token concrète.
- **Une phrase forte pour finir :** « Cet agent tourne sur mon ordinateur, gratuitement — l'IA n'est plus réservée aux grandes entreprises. »
