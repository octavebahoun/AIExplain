import { createShapeId, toRichText } from '@tldraw/tldraw';

const DEFAULT_STYLES = {
  color: 'black',
  size: 'm',
  font: 'sans',
  fill: 'none',
  dash: 'draw',
};

export const convertToTldrawShapes = (jsonShapes) => {
  if (!jsonShapes || !Array.isArray(jsonShapes)) return [];

  return jsonShapes.map((shape) => {
    const id = createShapeId();

    if (shape.type === 'geo') {
      return {
        id,
        type: 'geo',
        x: shape.x ?? 0,
        y: shape.y ?? 0,
        props: {
          ...DEFAULT_STYLES,
          w: Math.max(shape.w ?? 120, 100),
          h: Math.max(shape.h ?? 60, 50),
          geo: shape.geo === 'ellipse' ? 'ellipse' : 'rectangle',
          richText: toRichText(shape.label ?? ''),
          align: 'middle',
          verticalAlign: 'middle',
        },
      };
    }

    if (shape.type === 'arrow') {
      const from = shape.from ?? { x: 0, y: 0 };
      const to = shape.to ?? { x: 100, y: 100 };

      return {
        id,
        type: 'arrow',
        x: from.x,
        y: from.y,
        props: {
          ...DEFAULT_STYLES,
          fill: 'none',
          arrowheadEnd: 'arrow',
          arrowheadStart: 'none',
          bend: 0,
          start: { x: 0, y: 0 },
          end: { x: to.x - from.x, y: to.y - from.y },
          richText: toRichText(shape.label ?? ''),
        },
      };
    }

    if (shape.type === 'text') {
      return {
        id,
        type: 'text',
        x: shape.x ?? 0,
        y: shape.y ?? 0,
        props: {
          color: DEFAULT_STYLES.color,
          size: DEFAULT_STYLES.size,
          font: DEFAULT_STYLES.font,
          richText: toRichText(shape.label ?? ''),
          autoSize: true,
          w: 200,
          textAlign: 'middle',
        },
      };
    }

    return null;
  }).filter(Boolean);
};