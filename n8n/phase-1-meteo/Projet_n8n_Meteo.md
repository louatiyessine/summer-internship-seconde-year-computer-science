# Projet n8n — Bulletin Météo Quotidien Automatisé

**Auteur :** Yessine Louati
**Outil :** n8n (automatisation de workflow, sans code)
**Statut :** Fonctionnel et déployé (workflow actif)

---

## 1. Objectif

Automatiser l'envoi d'un **bulletin météo quotidien par email**. Chaque jour à **8h00**, le système récupère automatiquement la météo de **Sfax** depuis une API sur internet, en extrait les informations utiles, et les envoie par email à une liste de destinataires — le tout sans aucune intervention humaine.

---

## 2. Architecture du workflow

Le workflow est une chaîne de 5 étapes (nodes). Les données circulent de gauche à droite.

```
┌──────────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────┐
│ Schedule Trigger │──▶│ HTTP Request │──▶│ Edit Fields  │──▶│    IF    │
│  (chaque jour 8h)│   │ (API météo)  │   │  (extraire)  │   │ (pluie ?)│
└──────────────────┘   └──────────────┘   └──────────────┘   └────┬─────┘
                                                                   │
                                              ┌────────────────────┴───────────────────┐
                                              │ TRUE (il pleut)      FALSE (pas de pluie)│
                                              ▼                                         ▼
                                     ┌──────────────────┐                    ┌──────────────────┐
                                     │  Gmail — Email    │                    │  Gmail — Email    │
                                     │ avec alerte ☔     │                    │  normal ☀️        │
                                     └──────────────────┘                    └──────────────────┘
```

---

## 3. Détail des étapes

| # | Node | Rôle |
|---|------|------|
| 1 | **Schedule Trigger** | Déclenche le workflow automatiquement chaque jour à 08h00 (fuseau Africa/Tunis). |
| 2 | **HTTP Request** | Appelle l'API OpenWeatherMap (méthode GET) avec les coordonnées GPS de Sfax et récupère la météo au format JSON. |
| 3 | **Edit Fields** | Extrait uniquement les données utiles du JSON : ville, température, ressenti, min, max, humidité, description. |
| 4 | **IF** | Logique de décision : vérifie si la description contient le mot « pluie » et oriente le flux vers l'un des deux emails. |
| 5 | **Gmail (x2)** | Envoie l'email formaté (HTML) aux destinataires. Version *true* avec alerte parapluie, version *false* sans. |

---

## 4. Détails techniques

- **API utilisée :** OpenWeatherMap — endpoint *Current Weather Data*.
- **Authentification :** clé API (paramètre `appid`), stockée de façon sécurisée.
- **Localisation :** coordonnées GPS de Sfax (`lat = 34.7406`, `lon = 10.7603`) pour une précision exacte.
- **Paramètres API :** `units=metric` (°C) et `lang=fr` (descriptions en français).
- **Envoi email :** node Gmail connecté via OAuth2 (compte Google autorisé).
- **Données dynamiques :** insérées dans l'email via des expressions n8n `{{ $json.champ }}`.
- **Déploiement :** workflow publié et actif sur n8n Cloud (exécution sur serveur, 24h/24, indépendante de l'ordinateur de l'utilisateur).

---

## 5. Résultat

Chaque matin à 8h00, tous les destinataires reçoivent automatiquement un email contenant : la ville, la température actuelle, le ressenti, le min/max, l'humidité, la description du ciel, et une alerte parapluie si de la pluie est détectée.

---

## 6. Compétences acquises

Ce projet couvre les 4 piliers fondamentaux de l'automatisation avec n8n :
**déclencheur** (Schedule), **appel d'API** (HTTP Request), **traitement de données** (extraction JSON), et **logique de décision** (IF) — ainsi que la gestion des clés API, des credentials et des expressions dynamiques.
