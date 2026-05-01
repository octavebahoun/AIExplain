import { createShapeId, toRichText } from '@tldraw/tldraw';

export const convertToTldrawShapes = (jsonShapes) => {
  if (!jsonShapes || !Array.isArray(jsonShapes)) return [];

  return jsonShapes.map((shape) => {
    const id = createShapeId();
    
    if (shape.type === 'geo') {
      return {
        id,
        type: 'geo',
        x: shape.x || 0,
        y: shape.y || 0,
        props: {
          w: shape.w || 100,
          h: shape.h || 100,
          geo: shape.geo === 'ellipse' ? 'ellipse' : 'rectangle',
          richText: toRichText(shape.label || ''),
        }
      };
    }
    
    if (shape.type === 'arrow') {
      const from = shape.from || { x: 0, y: 0 };
      const to = shape.to || { x: 100, y: 100 };
      
      return {
        id,
        type: 'arrow',
        x: from.x,
        y: from.y,
        props: {
          start: { x: 0, y: 0 },
          end: { x: to.x - from.x, y: to.y - from.y },
          richText: toRichText(shape.label || ''),
        }
      };
    }
    
    if (shape.type === 'text') {
      return {
        id,
        type: 'text',
        x: shape.x || 0,
        y: shape.y || 0,
        props: {
          richText: toRichText(shape.label || ''),
        }
      };
    }
    
    return null;
  }).filter(Boolean);
};
