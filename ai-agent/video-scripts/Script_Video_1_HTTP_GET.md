# 🎬 Script Vidéo 1 — HTTP & GET (~8 min)

> Texte normal = ce que tu **DIS**. Blocs `[ ]` = ce que tu **MONTRES**.
> À préparer : Excalidraw, Chrome, VS Code (`somme.py`), Postman, 2 images (Annexe B).

---

## 1 — Intro (0:00 – 0:40)

`[CAMÉRA]`

Bonjour à tout le monde ! Quand vous tapez quelque chose dans Google, comment le bon résultat apparaît sur votre écran ? Qu'est-ce qui se passe derrière ?

Aujourd'hui, je vous explique tout, inchaAllah. Et même si vous ne connaissez rien à l'informatique, vous allez comprendre. C'est parti !

`[INCRUSTATION : « Vidéo 1 — Comment les sites communiquent »]`

---

## 2 — C'est quoi HTTP ? (0:40 – 1:30)

`[CAMÉRA]`

Tout commence par un mot au début des adresses : **HTTP**.

HTTP, c'est un **langage**. La langue commune que tous les ordinateurs utilisent pour se parler sur Internet.

`[INCRUSTATION : « HTTP = le langage commun du web »]`

Et ça marche en deux temps : votre ordinateur envoie une **requête** (une question), et le serveur renvoie une **réponse**.

Une requête, c'est une question. Regardons à quoi elle ressemble.

---

## 3 — Header & Body : le colis (1:30 – 3:00)

`[ÉCRAN — EXCALIDRAW]`

Une requête, c'est comme un **colis**. Elle a deux parties.

`[EXCALIDRAW — rectangle, écrire "HEADER" en haut]`

En haut, le **Header** : c'est l'**étiquette** du colis. Qui envoie, à qui, l'adresse… bref, les **infos générales**.

`[EXCALIDRAW — écrire "BODY" en bas]`

En bas, le **Body** : c'est **le contenu**, ce qu'il y a à l'intérieur. Les **vraies données** qu'on envoie.

`[INCRUSTATION : « Header = l'étiquette · Body = le contenu »]`

Header, c'est l'étiquette. Body, c'est le contenu. Voilà, c'est tout !

---

## 4 — GET, POST, PUT, DELETE (3:00 – 4:00)

`[CAMÉRA]`

Quand on envoie une requête, on doit dire ce qu'on veut faire. Pour ça, il y a des **méthodes**. Les quatre principales :

`[ÉCRAN — IMAGE 1]`

**GET** : lire une information.
**POST** : créer, ajouter.
**PUT** : modifier.
**DELETE** : supprimer.

`[INCRUSTATION : « GET lire · POST créer · PUT modifier · DELETE supprimer »]`

Aujourd'hui, on se concentre sur **GET**, celle qui lit. Et on va la voir en vrai.

---

## 5 — Démo Chrome : Network & Status (4:00 – 5:30)

`[ÉCRAN — Chrome sur google.com]`

Je suis sur Google. Derrière, plein de requêtes partent et reviennent. Je vais vous les montrer.

`[ÉCRAN — clic droit → Inspecter (ou F12)]`

Je fais clic droit, puis **Inspecter**. C'est l'outil qui montre les coulisses.

`[ÉCRAN — onglet Network, puis taper une recherche]`

Je vais dans l'onglet **Network**, et je tape une recherche. Regardez : chaque ligne est une **requête**.

`[ÉCRAN — cliquer une ligne, montrer Header et "Status: 200"]`

Si je clique, je vois le **Header**, et un numéro important : le **statut**. Ici, **200**.

`[ÉCRAN — IMAGE 2]`

Petite parenthèse. Le statut dit comment ça s'est passé :

**2xx** (comme 200) : tout va bien.
**4xx** (comme 404) : erreur de votre côté, la page n'existe pas.
**5xx** (comme 500) : erreur du côté du serveur.

`[INCRUSTATION : « 2xx OK · 4xx erreur client · 5xx erreur serveur »]`

Donc **200**, ça veut dire : c'est bon. Maintenant, créons notre propre serveur !

---

## 6 — VS Code : la fonction, puis Flask (5:30 – 7:00)

`[ÉCRAN — VS Code, fichier somme.py]`

Dans VS Code, je crée `somme.py`. On fait une fonction simple qui additionne deux nombres.

`[ÉCRAN — écrire]`
```python
def somme(a, b):
    return a + b

print(somme(5, 7))
```

`[ÉCRAN — lancer, montrer 12]`

Je lance : **12**. Parfait.

`[CAMÉRA]`

Mais je peux seulement la lancer **ici**, dans VS Code. Pour l'utiliser dans un navigateur, il me manque **Flask**.

`[INCRUSTATION : « Flask = transforme mon code en serveur web »]`

Flask, c'est un outil qui transforme mon code en **serveur web**. Un serveur, c'est un programme qui attend des requêtes et qui répond.

`[ÉCRAN — compléter le fichier]`
```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/somme/<int:a>/<int:b>", methods=["GET"])
def somme(a, b):
    return jsonify({"resultat": a + b})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

`[ÉCRAN — surligner @app.route]`

`@app.route`, c'est l'**adresse** de ma fonction. Je dis : « quand on vient à `/somme` avec deux nombres, en **GET**, lance ma fonction ».

`[ÉCRAN — surligner jsonify]`

**JSON**, c'est un format universel pour échanger des données, en paires **clé : valeur**. Et **jsonify** transforme mon résultat en JSON.

`[ÉCRAN — lancer, montrer "Running on 127.0.0.1:8000"]`

Je lance : mon serveur tourne !

---

## 7 — Postman + IP/port (7:00 – 7:40)

`[ÉCRAN — Postman, GET + http://127.0.0.1:8000/somme/5/7]`

Pour le tester, j'utilise **Postman** : un outil pour envoyer des requêtes à la main.

`[INCRUSTATION : « 127.0.0.1 = mon ordinateur · 8000 = la porte »]`

**127.0.0.1**, c'est l'adresse de ma machine, aussi appelée **localhost**. **8000**, c'est la porte par laquelle le serveur écoute.

`[ÉCRAN — Send, ZOOM sur la réponse]`

J'envoie… et il répond **`{ "resultat": 12 }`**, avec le statut **200**. On retrouve tout : le Header, le Body, le statut.

---

## 8 — Navigateur + conclusion (7:40 – 8:15)

`[ÉCRAN — Chrome : http://localhost:8000/somme/5/7]`

Et pour finir, je tape la même adresse dans le **navigateur**… et **12** s'affiche !

`[CAMÉRA]`

Le navigateur a envoyé une requête **GET**, exactement comme Google au début de la vidéo. La boucle est bouclée !

`[INCRUSTATION — résumé]`

En résumé : HTTP = le langage du web. Une requête = un colis (Header + Body). GET lire, POST créer, PUT modifier, DELETE supprimer. Le statut 200 = tout va bien. Et on a créé notre serveur avec Flask.

Dans la prochaine vidéo : la méthode **POST** pour ajouter des données, et une vraie page web. Partagez si ça vous a plu, à bientôt ! 👋

---

# 📎 Annexe A — Code `somme.py`

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/somme/<int:a>/<int:b>", methods=["GET"])
def somme(a, b):
    return jsonify({"resultat": a + b})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

Lancer : `pip install flask` puis `python somme.py` → tester `http://localhost:8000/somme/5/7` → `{ "resultat": 12 }`.
(Port 8080 bloqué sur ta machine → on utilise 8000.)

# 📎 Annexe B — Images à préparer

- **IMAGE 1** : chercher `HTTP methods GET POST PUT DELETE CRUD`.
- **IMAGE 2** : chercher `HTTP status codes 2xx 3xx 4xx 5xx`.

# 📎 Annexe C — Dessin Excalidraw (Scène 3)

Un rectangle vertical → partie haut = **HEADER** (« infos / adresse »), partie bas = **BODY** (« les données »).
