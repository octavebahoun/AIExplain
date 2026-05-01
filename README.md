# AI Whiteboard

> Transforme n'importe quel concept en explication visuelle interactive — propulsé par l'IA, dessiné sur un canvas en temps réel.

![AI Whiteboard](https://img.shields.io/badge/status-MVP-blueviolet) ![React](https://img.shields.io/badge/React-18-61dafb) ![tldraw](https://img.shields.io/badge/tldraw-v2-black) ![Vite](https://img.shields.io/badge/Vite-5-646cff)

---

## Comment ça marche

Tape un concept → choisis ton provider IA → obtiens une explication visuelle structurée sur un canvas interactif.

Chaque concept génère :
- Une **définition concise** dans le panneau latéral
- Une **décomposition multi-slides** dessinée directement sur tldraw (vue d'ensemble + zooms)
- Un canvas entièrement éditable que tu peux annoter, étendre ou réorganiser

---

## Fonctionnalités

- 🤖 **4 providers IA** — OpenAI, Gemini, Groq, OpenRouter (switchable sans rechargement)
- 🎨 **Canvas tldraw live** — entièrement interactif après génération
- 📑 **Navigation multi-slides** — un concept par slide, tout conservé en mémoire
- 📄 **Contexte optionnel** — colle un document ou article pour ancrer l'explication
- 🔧 **Tool calling forcé** — sortie structurée via function calling (zéro JSON halluciné)

---

## Stack technique

| Couche | Techno |
|--------|--------|
| Frontend | React 18 + Vite |
| Canvas | tldraw v2 |
| IA | OpenAI / Gemini / Groq / OpenRouter |
| Format de sortie | Function calling (tool use) |

---

## Démarrage

### 1. Cloner & installer

```bash
git clone https://github.com/octavebahoun/AIExplain ai-whiteboard
cd ai-whiteboard
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Remplis `.env` avec les clés des providers que tu veux utiliser :

```env
VITE_OPENAI_API_KEY=sk-...
VITE_GEMINI_API_KEY=AIza...
VITE_GROQ_API_KEY=gsk_...
VITE_OPENROUTER_API_KEY=sk-or-...
```

Tu n'as pas besoin des quatre — l'app fonctionne avec n'importe lequel.

### 3. Lancer

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173)

---

## Structure du projet

```
src/
├── App.jsx
├── components/
│   ├── ProviderSelector.jsx   # Sélection du provider IA
│   ├── ConceptInput.jsx       # Champ concept + déclencheur
│   ├── ContextTextarea.jsx    # Contexte long format (optionnel)
│   ├── SlideList.jsx          # Sidebar de navigation des slides
│   ├── Whiteboard.jsx         # Canvas tldraw + injection des shapes
│   └── Toast.jsx              # Notifications d'erreur / statut
└── lib/
    ├── drivers/
    │   ├── openai.js
    │   ├── gemini.js
    │   ├── groq.js
    │   └── openrouter.js
    ├── driverRouter.js        # Redirige vers le driver actif
    ├── promptBuilder.js       # Construit le prompt système
    ├── toolSchema.js          # Schéma function calling partagé
    └── shapeBuilder.js        # Convertit le JSON IA → shapes tldraw
```

---

## Providers & modèles supportés

| Provider | Modèle par défaut | Tool calling |
|----------|------------------|--------------|
| OpenAI | `gpt-4o-mini` | ✅ |
| Gemini | `gemini-2.0-flash` | ✅ |
| Groq | `llama-3.3-70b-versatile` | ✅ |
| OpenRouter | au choix | ⚠️ dépend du modèle |

> Pour OpenRouter, utilise des modèles qui supportent explicitement le function calling (ex: `openai/gpt-4o-mini`, `anthropic/claude-haiku`).

---

## Comment fonctionne la sortie IA

L'IA est contrainte via **function calling** — elle ne peut pas retourner du texte libre. Chaque réponse doit correspondre à ce schéma :

```json
{
  "definition": "Explication en 2-3 phrases",
  "slides": [
    {
      "title": "Vue d'ensemble",
      "shapes": [
        { "type": "geo", "geo": "rectangle", "label": "Client", "x": 100, "y": 200, "w": 140, "h": 60 },
        { "type": "arrow", "from": { "x": 240, "y": 230 }, "to": { "x": 320, "y": 230 } },
        { "type": "geo", "geo": "ellipse", "label": "Serveur", "x": 320, "y": 200, "w": 140, "h": 60 }
      ]
    }
  ]
}
```

Minimum : **2 slides**, **4 shapes par slide**.

---

## Roadmap

- [x] 4 providers IA avec tool calling
- [x] Navigation multi-slides en mémoire
- [x] Injection de contexte optionnel
- [ ] Shapes avec couleurs (hiérarchie visuelle sémantique)
- [x] Export des slides en PNG / PDF
- [ ] Sessions persistantes (Supabase)
- [ ] URLs de slides partageables
- [ ] Authentification (Clerk)

---

## Licence

Ce projet est à usage personnel et éducatif uniquement.

Aucune commercialisation n'est autorisée sans l'accord préalable de l'auteur de tldraw, la licence commerciale n'ayant pas été acquise. Voir : [tldraw pricing](https://tldraw.dev/community/license).

Ce projet est fourni tel quel, sans garantie d'aucune sorte. L'auteur ne saurait être tenu responsable des conséquences liées à l'utilisation de ce code.