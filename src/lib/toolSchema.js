// lib/toolSchema.js

const shapeSchema = {
    type: "object",
    oneOf: [
        {
            title: "Geo",
            required: ["type", "geo", "label", "x", "y", "w", "h"],
            properties: {
                type: { type: "string", enum: ["geo"] },
                geo: { type: "string", enum: ["rectangle", "ellipse"] },
                label: { type: "string", maxLength: 40 },
                x: { type: "number", minimum: 50, maximum: 750 },
                y: { type: "number", minimum: 50, maximum: 450 },
                w: { type: "number", minimum: 100, maximum: 300 },
                h: { type: "number", minimum: 50, maximum: 150 },
            },
        },
        {
            title: "Arrow",
            required: ["type", "from", "to"],
            properties: {
                type: { type: "string", enum: ["arrow"] },
                label: { type: "string", maxLength: 20 },
                from: {
                    type: "object",
                    required: ["x", "y"],
                    properties: {
                        x: { type: "number" },
                        y: { type: "number" },
                    },
                },
                to: {
                    type: "object",
                    required: ["x", "y"],
                    properties: {
                        x: { type: "number" },
                        y: { type: "number" },
                    },
                },
            },
        },
        {
            title: "Text",
            required: ["type", "label", "x", "y"],
            properties: {
                type: { type: "string", enum: ["text"] },
                label: { type: "string", maxLength: 60 },
                x: { type: "number", minimum: 50, maximum: 750 },
                y: { type: "number", minimum: 50, maximum: 450 },
            },
        },
    ],
};

export const WHITEBOARD_TOOL = {
    type: "function",
    function: {
        name: "create_visual_explanation",
        description: `Génère une explication visuelle pédagogique d'un concept sous forme de slides.
    Slide 1 = vue d'ensemble avec tous les composants reliés.
    Slides suivants = zoom sur chaque sous-partie.
    Chaque composant majeur = une geo. Chaque relation = une arrow.`,
        parameters: {
            type: "object",
            required: ["definition", "slides"],
            properties: {
                definition: {
                    type: "string",
                    description: "Définition claire du concept en 2-3 phrases maximum.",
                    maxLength: 400,
                },
                slides: {
                    type: "array",
                    minItems: 2,
                    maxItems: 5,
                    items: {
                        type: "object",
                        required: ["title", "shapes"],
                        properties: {
                            title: {
                                type: "string",
                                maxLength: 30,
                                description: "Titre court du slide, 3 mots max.",
                            },
                            shapes: {
                                type: "array",
                                minItems: 4,
                                maxItems: 12,
                                items: shapeSchema,
                                description: "Minimum 4 shapes. Au moins 2 geo + 1 arrow obligatoires.",
                            },
                        },
                    },
                },
            },
        },
    },
};