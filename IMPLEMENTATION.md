# Plan d'implémentation — AI Whiteboard

lis d'abors les skills suivant a applique stritement sans detour dan sl'iplmentation du projet  , lit les skills present dans le dossier ~/.agents/skills !
tu utilisera ceci dans ce projet
3d-web-experience
copywriting
docker-expert
frontend-design
frontend-developer
product-manager-toolkit
ui-ux-pro-max
web-artifacts-builder

donc lis les et prepare toi a les respexter strictement ! 
## Phase 0 — Setup projet (30 min)

- [ ] `npm install @tldraw/tldraw`
- [ ] Créer `.env` + `.env.example` avec les 4 clés
- [ ] Nettoyer le boilerplate Vite
- [ ] Vérifier que tldraw s'affiche (test blank canvas)

---

## Phase 1 — Shell UI + navigation (1h)

Objectif : l'interface est en place, sans logique IA.

```
┌─────────────────────────────────────────────┐
│  [Provider ▼]  [Concept...]  [Expliquer]    │
├──────────┬──────────────────────────────────┤
│ Slides   │                                  │
│ > Slide1 │         tldraw canvas            │
│   Slide2 │                                  │
│ [+ Nouveau]                                 │
└──────────┴──────────────────────────────────┘
```

- [ ] `App.jsx` — layout principal (sidebar + canvas + topbar)
- [ ] `ProviderSelector.jsx` — dropdown 4 providers + state global
- [ ] `ConceptInput.jsx` — champ texte + bouton + toggle contexte
- [ ] `ContextTextarea.jsx` — textarea collapsible + compteur tokens
- [ ] `SlideList.jsx` — liste slides, navigation, bouton Nouveau
- [ ] `Whiteboard.jsx` — canvas tldraw vide monté

---

## Phase 2 — Drivers IA (1h30)

Objectif : chaque driver appelle son API et retourne le même format JSON.

Interface commune attendue par tous les drivers :
```js
// retourne toujours :
{ definition: string, slides: Slide[] }

// Slide :
{ title: string, shapes: TldrawShape[] }
```

- [ ] `lib/drivers/openai.js`
- [ ] `lib/drivers/gemini.js`
- [ ] `lib/drivers/groq.js`
- [ ] `lib/drivers/openrouter.js`
- [ ] `lib/driverRouter.js` — sélectionne le bon driver selon provider actif
- [ ] `lib/promptBuilder.js` — construit le prompt système (avec/sans contexte)

**Prompt système :**
```
Tu es un assistant pédagogique visuel.
Retourne UNIQUEMENT un JSON valide (sans markdown) :
{
  "definition": "...",
  "slides": [
    {
      "title": "...",
      "shapes": [ ...tldraw shapes... ]
    }
  ]
}
[SI CONTEXTE] Base-toi prioritairement sur ce texte : {context}
```

---

## Phase 3 — Injection shapes sur tldraw (1h)

Objectif : le JSON IA devient des formes sur le canvas.

- [ ] `lib/shapeBuilder.js` — convertit shapes JSON → objets tldraw valides
- [ ] Gérer les types : `geo` (rectangle, ellipse), `arrow`, `text`
- [ ] Dans `Whiteboard.jsx` : utiliser `editor.createShapes()` via le hook `useEditor`
- [ ] Centrer automatiquement les shapes après injection (`editor.zoomToFit()`)
- [ ] Vider le canvas avant chaque nouvelle génération sur le slide actif

---

## Phase 4 — Gestion multi-slides (45 min)

Objectif : chaque génération = un slide stocké en mémoire.

Structure state global :
```js
{
  slides: [
    { id, title, definition, shapes }
  ],
  activeSlideId: string
}
```

- [ ] State slides dans `App.jsx` (ou Context API)
- [ ] `SlideList.jsx` — clic sur slide → charge ses shapes dans le canvas
- [ ] Bouton "Nouveau slide" → reset champ concept sans vider les slides
- [ ] Empêcher l'écrasement d'un slide lors du switch

---

## Phase 5 — Gestion des erreurs + polish (45 min)

- [ ] Spinner pendant l'appel API
- [ ] Toast d'erreur si provider KO ou JSON mal formé
- [ ] Retry silencieux 1x si JSON invalide
- [ ] Alerte si clé API manquante au moment de l'appel
- [ ] Compteur tokens dans `ContextTextarea`
- [ ] Désactiver le bouton "Expliquer" si champ vide

---

## Ordre de dev recommandé

```
Phase 0 → Phase 1 → Phase 2 (un seul driver d'abord,openrouter )
→ Phase 3 → tester end-to-end
→ Phase 2 (les 3 autres drivers)
→ Phase 4 → Phase 5
```

---

## Fichiers finaux

```
src/
├── App.jsx
├── main.jsx
├── index.css
├── components/
│   ├── ProviderSelector.jsx
│   ├── ConceptInput.jsx
│   ├── ContextTextarea.jsx
│   ├── SlideList.jsx
│   ├── Whiteboard.jsx
│   └── Toast.jsx
└── lib/
    ├── drivers/
    │   ├── openai.js
    │   ├── gemini.js
    │   ├── groq.js
    │   └── openrouter.js
    ├── driverRouter.js
    ├── promptBuilder.js
    └── shapeBuilder.js
```


