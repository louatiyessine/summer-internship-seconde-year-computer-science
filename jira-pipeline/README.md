# jira-pipeline — Frontend Angular

Interface web **Angular 21** accompagnant le pipeline de résolution de tickets Jira
(voir le projet [`../ai-agent`](../ai-agent) pour le backend et l'intégration MCP).

## Démarrage

```bash
npm install
ng serve            # http://localhost:4200
```

## Scripts utiles

```bash
ng build            # build de production (dossier dist/)
ng test             # tests unitaires (Vitest)
```

## Structure

```
jira-pipeline/
├── src/
│   ├── app/        Composant principal (app.ts, app.html, app.css, app.config.ts)
│   ├── main.ts
│   └── index.html
├── public/         Ressources statiques
└── angular.json, package.json, tsconfig*.json
```

> `node_modules/`, `dist/` et `.angular/` sont exclus du dépôt — lancez `npm install`
> pour régénérer les dépendances.
