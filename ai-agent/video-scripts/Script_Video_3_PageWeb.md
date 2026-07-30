# 🎬 Script Vidéo 3 — Une vraie page web qui parle à notre serveur (~8 min)

> Texte normal = ce que tu **DIS**. Blocs `[ ]` = ce que tu **MONTRES**.
> À préparer : VS Code avec `somme.py` (Vidéo 1) + un dossier `templates` contenant `index.html` (voir Annexe). Chrome.

---

## 1 — Intro (0:00 – 0:45)

`[CAMÉRA]`

Bonjour à tout le monde ! Jusqu'ici, pour tester notre serveur, on utilisait **Postman**. Mais soyons honnêtes : un vrai utilisateur **n'ouvre jamais Postman** !

Un vrai utilisateur, il veut une **page** avec des cases et un **bouton** sur lequel cliquer.

Alors aujourd'hui, on va construire cette page. Une vraie interface qui parle toute seule à notre serveur, inchaAllah. C'est parti !

`[INCRUSTATION : « Vidéo 3 — Connecter une page web au serveur »]`

---

## 2 — Les 3 langages d'une page web (0:45 – 1:45)

`[CAMÉRA]`

Une page web, c'est **trois langages** qui travaillent ensemble. Une image simple :

`[INCRUSTATION — 3 lignes qui apparaissent]`

Le **HTML**, c'est le **squelette** : les cases, les boutons, les titres. La structure.

Le **CSS**, c'est l'**habillage** : les couleurs, les tailles, le style. Le look.

Le **JavaScript**, c'est l'**action** : ce qui se passe quand on clique. Le mouvement.

`[INCRUSTATION : « HTML = squelette · CSS = look · JavaScript = action »]`

Aujourd'hui, on va surtout se concentrer sur le **HTML** pour dessiner la page, et le **JavaScript** pour la faire parler à notre serveur.

---

## 3 — Construire la page (HTML) (1:45 – 3:30)

`[ÉCRAN — VS Code : créer un dossier "templates", puis "index.html" dedans]`

Dans mon projet, je crée un dossier `templates`, et dedans un fichier `index.html`. C'est là que va vivre ma page.

`[ÉCRAN — écrire le HTML, partie visible]`
```html
<h1>Additionner deux nombres</h1>

<input id="a" type="number" placeholder="Nombre A">
<input id="b" type="number" placeholder="Nombre B">

<button onclick="calculer()">Calculer</button>

<p id="resultat"></p>
```

Je vous explique ces lignes, elles sont simples.

`[ÉCRAN — surligner les deux input]`

`input`, ce sont les deux **cases** où l'utilisateur va taper ses nombres. Je leur donne un nom : `a` et `b`.

`[ÉCRAN — surligner le button]`

`button`, c'est le **bouton** « Calculer ». Et remarquez : `onclick="calculer()"`. Ça veut dire : « quand on clique, lance la fonction `calculer` ». Cette fonction, on va l'écrire dans une minute.

`[ÉCRAN — surligner le paragraphe résultat]`

Et ce `p` vide, c'est l'**endroit** où on va afficher le résultat.

---

## 4 — Servir la page depuis Flask (3:30 – 4:30)

`[CAMÉRA]`

Maintenant, il faut **afficher** cette page. Le plus simple : c'est notre **serveur Flask lui-même** qui va la donner. Comme ça, la page et l'API sont au **même endroit**.

`[ÉCRAN — dans somme.py, ajouter la route "/"]`
```python
from flask import Flask, jsonify, render_template

@app.route("/")
def accueil():
    return render_template("index.html")
```

`[ÉCRAN — surligner render_template]`

`render_template("index.html")`, ça veut dire : « va chercher ma page dans le dossier `templates`, et affiche-la ». C'est pour ça qu'on a mis le fichier dans ce dossier.

`[ÉCRAN — lancer python somme.py, ouvrir Chrome sur localhost:8000]`

Je lance le serveur, j'ouvre le navigateur sur `localhost:8000`… et voilà **ma page** ! Avec les deux cases et le bouton.

`[ÉCRAN — cliquer le bouton, il ne se passe rien encore]`

Mais si je clique… il ne se passe rien. Normal : la fonction `calculer` n'existe pas encore. On l'écrit maintenant.

---

## 5 — Faire parler la page (JavaScript) (4:30 – 6:15)

`[ÉCRAN — dans index.html, ajouter le script en bas]`
```html
<script>
  async function calculer() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;

    const reponse = await fetch(`/somme/${a}/${b}`);
    const data = await reponse.json();

    document.getElementById("resultat").innerText = "Résultat : " + data.resultat;
  }
</script>
```

Je vous explique, ligne par ligne.

`[ÉCRAN — surligner les 2 const a / b]`

D'abord, je **récupère** ce que l'utilisateur a tapé dans les cases `a` et `b`.

`[ÉCRAN — surligner la ligne fetch]`

Ensuite, la ligne la plus importante : **`fetch`**. `fetch`, c'est l'**outil du navigateur pour envoyer une requête HTTP**. Exactement ce que faisait Postman, mais cette fois c'est la **page** qui le fait, toute seule ! J'appelle notre API `/somme` avec les deux nombres.

`[ÉCRAN — surligner reponse.json()]`

Le serveur répond en **JSON**. Cette ligne transforme la réponse pour que je puisse l'utiliser.

`[ÉCRAN — surligner la dernière ligne]`

Et enfin, j'**affiche** le résultat dans mon paragraphe.

`[CAMÉRA]`

Voilà : la page va maintenant envoyer la requête et afficher la réponse, sans Postman !

---

## 6 — La démo finale (6:15 – 7:30)

`[ÉCRAN — Chrome, recharger localhost:8000]`

Je recharge ma page. Je tape **5** dans la première case, **7** dans la deuxième…

`[ÉCRAN — cliquer "Calculer", ZOOM sur le résultat]`

Je clique sur **Calculer**… et **Résultat : 12** s'affiche ! 🎉 Notre page parle à notre serveur.

`[ÉCRAN — ouvrir F12 → onglet Network, recliquer Calculer]`

Et pour la magie finale, souvenez-vous de la Vidéo 1 : j'ouvre l'inspecteur, onglet **Network**, et je reclique…

`[ÉCRAN — montrer la requête /somme qui apparaît, statut 200]`

Regardez : notre requête `/somme` **part en direct**, avec le statut **200** ! C'est exactement ce qu'on voyait sur Google. Sauf que là, c'est **nous** qui avons tout construit.

---

## 7 — Conclusion + teaser (7:30 – 8:15)

`[CAMÉRA]`

`[INCRUSTATION — résumé]`

En résumé : une page web, c'est **HTML** (le squelette), **CSS** (le look) et **JavaScript** (l'action). Grâce à **`fetch`**, notre page envoie une requête à notre serveur, récupère la réponse en JSON, et l'affiche. Plus besoin de Postman !

`[CAMÉRA]`

Et là, vous avez fait quelque chose de génial : vous avez construit **le tout début d'une vraie application** — une interface **et** un serveur qui communiquent.

Dans les prochaines vidéos, on ira encore plus loin. Partagez si ça vous a plu, et à très vite, inchaAllah ! 👋

`[INCRUSTATION : « Bravo, tu as créé ta première application ! »]`

---

# 📎 Annexe A — Structure des fichiers

```
tutorial/
├── somme.py
└── templates/
    └── index.html
```

> ⚠️ Important : le fichier `index.html` doit être dans un dossier **`templates`** (nom exact), sinon `render_template` ne le trouve pas.

---

# 📎 Annexe B — `somme.py` (mis à jour)

```python
from flask import Flask, jsonify, render_template

app = Flask(__name__)

# La page web
@app.route("/")
def accueil():
    return render_template("index.html")

# L'API qui additionne (Vidéo 1)
@app.route("/somme/<int:a>/<int:b>", methods=["GET"])
def somme(a, b):
    return jsonify({"resultat": a + b})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

---

# 📎 Annexe C — `templates/index.html` (complet, avec un peu de style)

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Calculatrice</title>
  <style>
    body { font-family: Arial; text-align: center; margin-top: 60px; }
    input, button { padding: 10px; font-size: 16px; margin: 5px; }
    button { cursor: pointer; }
    #resultat { font-size: 22px; margin-top: 20px; font-weight: bold; }
  </style>
</head>
<body>

  <h1>Additionner deux nombres</h1>

  <input id="a" type="number" placeholder="Nombre A">
  <input id="b" type="number" placeholder="Nombre B">
  <button onclick="calculer()">Calculer</button>

  <p id="resultat"></p>

  <script>
    async function calculer() {
      const a = document.getElementById("a").value;
      const b = document.getElementById("b").value;

      const reponse = await fetch(`/somme/${a}/${b}`);
      const data = await reponse.json();

      document.getElementById("resultat").innerText = "Résultat : " + data.resultat;
    }
  </script>

</body>
</html>
```

**Lancer :** `python somme.py` → ouvrir `http://localhost:8000` → taper 2 nombres → **Calculer**.

> 💡 Comme la page est servie par Flask (même serveur, même adresse `localhost:8000`), pas de problème de sécurité entre la page et l'API. Tout est au même endroit.
