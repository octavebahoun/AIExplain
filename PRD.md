# PRD — AI Whiteboard
**Version** : 1.0 | **Date** : Mai 2026 | **Auteur** : Oktav

---

## 1. Vue d'ensemble

AI Whiteboard est un outil pédagogique local qui transforme un concept textuel en une explication + représentation visuelle interactive générée par IA, affichée sur un canvas tldraw exportable en slide.

---

## 2. Objectif

Permettre à n'importe qui de **comprendre visuellement un concept** en une seule frappe — en choisissant son provider IA préféré.

---

## 3. Utilisateurs cibles

- Étudiants / apprenants visuels
- Formateurs / enseignants
- Développeurs qui apprennent de nouveaux concepts

---

## 4. Fonctionnalités principales

### 4.1 Sélection du provider IA
L'utilisateur choisit parmi 4 drivers avant de lancer une requête :

| Provider | Auth |
|----------|------|
| OpenAI (GPT-4o) | `OPENAI_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| Groq | `GROQ_API_KEY` |
| OpenRouter | `OPENROUTER_API_KEY` |

Les clés sont stockées dans un fichier `.env` local. Le switch de provider est disponible dans la barre de contrôle sans recharger la page.

---

### 4.2 Saisie du concept

- Champ texte simple (ex: "La récursivité", "TCP/IP", "Un arbre binaire")
- Bouton **"Expliquer"** ou touche `Entrée` pour lancer
- Un seul concept traité à la fois

#### Contexte textuel (optionnel)

Un champ textarea collapsible **"Ajouter un contexte"** permet à l'utilisateur de coller un texte long (cours, documentation, article) sur lequel le modèle doit **prioritairement se baser** pour construire son explication et ses visuels.

- Si renseigné : le texte est injecté dans le prompt système comme source de référence principale
- Si vide : le modèle utilise ses connaissances générales
- Limite recommandée : 8 000 tokens (affiché avec un compteur)
- Le champ est **masqué par défaut** et s'ouvre via un bouton toggle

---

### 4.3 Réponse de l'IA

L'IA retourne un JSON structuré :

```json
{
  "definition": "Texte court de définition (2-4 phrases max)",
  "shapes": [
    {
      "type": "geo",
      "label": "Noeud racine",
      "x": 300, "y": 200,
      "w": 120, "h": 60,
      "geo": "rectangle"
    },
    {
      "type": "arrow",
      "from": { "x": 360, "y": 260 },
      "to": { "x": 260, "y": 340 }
    },
    {
      "type": "text",
      "label": "Gauche",
      "x": 200, "y": 340
    }
  ]
}
```

---

### 4.4 Affichage sur tldraw

- La définition apparaît dans un panneau latéral (à gauche ou en haut)
- Les shapes sont injectées sur le canvas via `editor.createShapes()`
- L'utilisateur peut **modifier manuellement** le canvas après génération (ajouter, déplacer, annoter)

---

### 4.5 Visualisation multi-slides

Chaque concept généré crée un **slide indépendant** dans une liste latérale :

- Les slides sont numérotés et navigables (Slide 1, Slide 2…)
- Cliquer sur un slide charge son canvas dans tldraw
- L'utilisateur peut générer plusieurs concepts successifs sans écraser le précédent
- Un bouton **"Nouveau slide"** réinitialise le champ concept sans vider les slides existants
- Les slides sont stockés en mémoire locale (pas de persistance entre sessions en v1)

> L'export des slides est **hors scope v1** — prévu en v2.

---

## 5. Architecture technique

```
ai-whiteboard/
├── src/
│   ├── App.jsx              # Shell principal
│   ├── components/
│   │   ├── ProviderSelector.jsx   # Dropdown 4 providers
│   │   ├── ConceptInput.jsx       # Champ + bouton
│   │   ├── DefinitionPanel.jsx    # Affichage texte
│   │   └── Whiteboard.jsx         # Canvas tldraw + injection shapes
│   ├── lib/
│   │   ├── drivers/
│   │   │   ├── openai.js
│   │   │   ├── gemini.js
│   │   │   ├── groq.js
│   │   │   └── openrouter.js
│   │   └── shapeBuilder.js        # Convertit JSON IA → tldraw shapes
│   └── main.jsx
├── .env                     # Clés API (non committé)
├── .env.example
├── package.json
└── vite.config.js
```

**Stack** : React 18 + Vite + tldraw v2 + Axios (ou fetch natif)

---

## 6. Flux utilisateur

```
[Ouvrir l'app]
    ↓
[Choisir provider → ex: Groq]
    ↓
[Taper "Arbre binaire de recherche"]
    ↓
[Cliquer Expliquer]
    ↓
[Spinner pendant l'appel API]
    ↓
[Définition dans le panneau + shapes sur le canvas]
    ↓
[Modifier manuellement si besoin]
    ↓
[Cliquer Exporter → PNG téléchargé]
```

---

## 7. Gestion des erreurs

| Cas | Comportement |
|-----|-------------|
| Clé API manquante | Message d'alerte visible dans l'UI |
| Provider indisponible | Toast d'erreur + suggestion de changer de provider |
| JSON IA mal formé | Retry silencieux (1x) puis message d'erreur |
| Canvas vide | Message "Aucune donnée à exporter" |

---

## 8. Hors scope (v1)

- Authentification utilisateur
- Sauvegarde cloud des sessions
- Historique des concepts
- Collaboration temps réel
- Export PNG/PDF des slides (prévu v2)
- Support mobile

---

## 9. Critères d'acceptation (MVP)

- [ ] Les 4 providers fonctionnent et sont switchables sans rechargement
- [ ] Un concept génère toujours une définition + au moins 2 shapes
- [ ] Le contexte optionnel est bien injecté dans le prompt quand renseigné
- [ ] La navigation multi-slides fonctionne sans perte de données entre slides
- [ ] L'app tourne en local avec un simple `npm run dev`
- [ ] Le `.env.example` documente toutes les clés nécessaires

---

## 10. Roadmap

| Phase | Contenu |
|-------|---------|
| v1 (MVP) | 4 providers + canvas + contexte optionnel + multi-slides en mémoire |
| v2 | Export PNG/PDF des slides, historique local persistant |
| v3 | Templates de diagrammes (flowchart, mindmap, timeline) |
