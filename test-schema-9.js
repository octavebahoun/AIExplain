import { createTLStore, defaultShapeUtils, createShapeId } from '@tldraw/tldraw';
const store = createTLStore({ shapeUtils: defaultShapeUtils });
const id = createShapeId();
// In tldraw, you can't just create shape in a store without proper records or you can just import TLTextShape
import { textShapeMigrations } from '@tldraw/tldraw';
console.log(textShapeMigrations);
