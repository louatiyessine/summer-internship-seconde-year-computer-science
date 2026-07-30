# 🎬 Script Vidéo 2 — POST : envoyer et enregistrer des données (~8 min)

> Texte normal = ce que tu **DIS**. Blocs `[ ]` = ce que tu **MONTRES**.
> À préparer : VS Code (`personnes.py`), Postman. (On réutilise ce qu'on a appris en Vidéo 1.)

---

## 1 — Intro (0:00 – 0:45)

`[CAMÉRA]`

Bonjour à tout le monde ! Dans la vidéo précédente, on a appris à **lire** une information avec la méthode **GET**.

Mais quand vous créez un compte, ou quand vous publiez une photo… l'application **enregistre** vos informations quelque part. Comment ? Ça, c'est le travail d'une autre méthode : **POST**.

Aujourd'hui, on va apprendre à **envoyer et enregistrer** des données, inchaAllah. C'est parti !

`[INCRUSTATION : « Vidéo 2 — La méthode POST »]`

---

## 2 — GET vs POST : où vont les données ? (0:45 – 2:00)

`[CAMÉRA]`

Petit rappel. **GET**, c'est pour **lire**. **POST**, c'est pour **créer**, ajouter une nouvelle information.

`[INCRUSTATION : « GET = lire · POST = créer »]`

Mais il y a une différence importante. Avec GET, on mettait les infos **dans l'adresse** (souvenez-vous : `/somme/5/7`).

Avec POST, on envoie des **vraies données**. Et où est-ce qu'on les met ? Rappelez-vous le **colis** de la Vidéo 1 : les données vont dans le **Body**, le contenu du colis.

`[INCRUSTATION : « POST → les données vont dans le Body »]`

Et ces données, on les écrit en **JSON** : des paires **clé : valeur**. Par exemple :

`[ÉCRAN — afficher un petit encadré]`
```json
{
  "name": "Ali",
  "age": 30
}
```

Ici, on envoie une personne : son nom, Ali, et son âge, 30. Allons construire le serveur qui reçoit ça.

---

## 3 — VS Code : la liste + la route POST (2:00 – 4:30)

`[ÉCRAN — VS Code, nouveau fichier personnes.py]`

Je crée un fichier `personnes.py`. D'abord, j'ai besoin d'un endroit pour **stocker** mes personnes. Je vais utiliser une **liste**, toute simple.

`[ÉCRAN — écrire]`
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# Notre "base de données" toute simple : une liste vide
personnes = []
```

Cette liste `personnes`, c'est comme un petit **carnet** vide où je vais noter les gens.

`[ÉCRAN — ajouter la route POST]`
```python
@app.route("/person", methods=["POST"])
def ajouter_personne():
    donnee = request.get_json()   # on lit le Body
    personnes.append(donnee)      # on l'ajoute à la liste
    return jsonify(personnes)     # on renvoie la liste
```

Je vous explique les 3 lignes importantes.

`[ÉCRAN — surligner request.get_json()]`

`request.get_json()` : ça **lit le Body** de la requête, c'est-à-dire le JSON qu'on a envoyé. Ici, notre personne.

`[ÉCRAN — surligner personnes.append(donnee)]`

`.append(...)` : ça **ajoute** cette personne dans notre liste. En français, « ajouter à la fin ».

`[ÉCRAN — surligner return jsonify(personnes)]`

Et on **renvoie la liste** complète, en JSON, pour voir le résultat.

`[ÉCRAN — ajouter la ligne de démarrage]`
```python
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

`[ÉCRAN — lancer : python personnes.py]`

Je lance mon serveur… il tourne. Il attend maintenant qu'on lui envoie une personne.

---

## 4 — Postman : envoyer une personne (4:30 – 6:30)

`[ÉCRAN — Postman]`

On retourne dans **Postman**. Mais cette fois, deux différences importantes.

`[ÉCRAN — choisir la méthode POST]`

D'abord, je choisis **POST**, pas GET, parce que je veux **créer**.

`[ÉCRAN — écrire l'URL http://localhost:8000/person]`

Ensuite l'adresse : `localhost:8000/person`.

`[ÉCRAN — cliquer l'onglet "Body" → "raw" → choisir "JSON"]`

Et surtout : comme j'envoie des données, je vais dans l'onglet **Body**. Je choisis **raw**, puis le format **JSON**. C'est ici que je mets le contenu de mon colis.

`[ÉCRAN — écrire dans le Body]`
```json
{ "name": "Ali", "age": 30 }
```

`[ÉCRAN — cliquer Send, ZOOM sur la réponse]`

J'envoie… et le serveur me répond avec la liste :

```json
[ { "name": "Ali", "age": 30 } ]
```

Ali est **enregistré** ! 🎉

`[ÉCRAN — changer le Body et renvoyer]`

Ajoutons-en une autre. Je change pour **Sara**, 25 ans, et j'envoie.

```json
{ "name": "Sara", "age": 25 }
```

`[ÉCRAN — ZOOM sur la réponse à 2 personnes]`

Et regardez : maintenant la liste contient **deux personnes**, Ali **et** Sara. Notre serveur garde bien tout en mémoire.

---

## 5 — Relire toute la liste avec GET (6:30 – 7:15)

`[ÉCRAN — VS Code, montrer une 2e route déjà ajoutée]`

Et si je veux juste **relire** la liste, sans rien ajouter ? Là, on réutilise notre ami **GET** !

`[ÉCRAN — montrer la route GET]`
```python
@app.route("/personnes", methods=["GET"])
def lister_personnes():
    return jsonify(personnes)
```

`[ÉCRAN — Postman ou navigateur : GET http://localhost:8000/personnes]`

Je fais un **GET** sur `/personnes`… et j'obtiens toute la liste : Ali et Sara.

`[CAMÉRA]`

Vous voyez comme tout se relie ? **POST** pour **ajouter**, **GET** pour **lire**. Exactement le CRUD dont on parlait !

---

## 6 — Conclusion + teaser (7:15 – 8:00)

`[CAMÉRA]`

`[INCRUSTATION — résumé]`

En résumé : **POST** sert à **créer** des données. Ces données voyagent dans le **Body**, en **JSON**. Côté serveur, on les lit avec `request.get_json()`, on les ajoute avec `.append()`, et on renvoie le résultat.

Un petit détail : ici, si je redémarre le serveur, ma liste se vide. Dans une vraie application, on garderait tout dans une **base de données** — mais ça, ce sera pour plus tard !

Dans la **prochaine vidéo**, on arrête Postman : on va construire une **vraie page web**, avec des cases et un bouton, qui parle à notre serveur toute seule.

Partagez si ça vous a plu, et à très vite, inchaAllah ! 👋

`[INCRUSTATION : « Prochaine vidéo : une vraie page web »]`

---

# 📎 Annexe A — Code complet `personnes.py`

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

# Notre "base de données" toute simple : une liste
personnes = []

# POST → ajouter une personne
@app.route("/person", methods=["POST"])
def ajouter_personne():
    donnee = request.get_json()   # lire le Body
    personnes.append(donnee)      # ajouter à la liste
    return jsonify(personnes)     # renvoyer la liste

# GET → lire toute la liste
@app.route("/personnes", methods=["GET"])
def lister_personnes():
    return jsonify(personnes)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

Lancer : `python personnes.py` (Flask déjà installé depuis la Vidéo 1).

---

# 📎 Annexe B — Étapes Postman (à répéter avant de filmer)

**Ajouter une personne (POST) :**
1. Méthode : **POST**
2. URL : `http://localhost:8000/person`
3. Onglet **Body** → **raw** → format **JSON**
4. Écrire : `{ "name": "Ali", "age": 30 }`
5. **Send** → réponse : `[ { "name": "Ali", "age": 30 } ]`
6. Recommencer avec `{ "name": "Sara", "age": 25 }` → la liste grandit.

**Lire toute la liste (GET) :**
- Méthode **GET** → URL `http://localhost:8000/personnes` → **Send**.

> ⚠️ Piège fréquent à éviter à l'écran : dans le Body, bien choisir **JSON** (pas « Text »), et mettre les guillemets `"..."` autour des clés et des mots. Sinon le serveur renvoie une erreur.
