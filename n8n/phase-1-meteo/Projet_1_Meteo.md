# Projet 1 — Bulletin Météo Quotidien Automatisé

**Outil :** n8n (automatisation no-code) · **Statut :** déployé et actif

---

## 1. Objectif
Envoyer automatiquement, **chaque jour à 8h00**, un bulletin météo de **Sfax** par email à une liste de destinataires — sans aucune intervention manuelle.

## 2. Architecture
```
┌──────────────────┐   ┌──────────────┐   ┌─────────────┐   ┌──────────┐
│ Schedule Trigger │──▶│ HTTP Request │──▶│ Edit Fields │──▶│    IF    │
│  (chaque jour 8h)│   │ (API météo)  │   │  (extraire) │   │ (pluie ?)│
└──────────────────┘   └──────────────┘   └─────────────┘   └────┬─────┘
                                                    ┌────────────┴────────────┐
                                                 TRUE (pluie)          FALSE (pas de pluie)
                                                    ▼                          ▼
                                            ┌───────────────┐          ┌───────────────┐
                                            │ Gmail + ☔     │          │ Gmail normal ☀│
                                            └───────────────┘          └───────────────┘
```

## 3. Rôle des nodes
| Node | Rôle |
|------|------|
| **Schedule Trigger** | Démarre le workflow chaque jour à 08h00 (fuseau Africa/Tunis). |
| **HTTP Request** | Appelle l'API OpenWeatherMap (GET) avec les coordonnées GPS de Sfax → JSON. |
| **Edit Fields** | Extrait les données utiles : ville, température, ressenti, min, max, humidité, description. |
| **IF** | Vérifie si la description contient « pluie » et oriente vers l'email adapté. |
| **Gmail (×2)** | Envoie l'email HTML formaté (version alerte parapluie / version normale). |

## 4. Détails techniques
- **API :** OpenWeatherMap (Current Weather), authentifiée par clé API (`appid`).
- **Localisation :** coordonnées GPS de Sfax (`lat=34.7406`, `lon=10.7603`) pour une précision exacte.
- **Paramètres :** `units=metric` (°C), `lang=fr` (français).
- **Email :** node Gmail via OAuth2 ; données insérées par expressions `{{ $json.champ }}`.
- **Déploiement :** workflow publié et actif sur n8n Cloud (serveur 24h/24).

## 5. Compétences mises en œuvre
Déclencheur planifié, appel d'API REST, lecture de JSON, extraction/transformation de données, logique conditionnelle (IF), expressions dynamiques, credentials sécurisés (clé API, OAuth).
