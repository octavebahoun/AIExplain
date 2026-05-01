import { createTLStore, defaultShapeUtils, createShapeId } from '@tldraw/tldraw';
const store = createTLStore({ shapeUtils: defaultShapeUtils });
const id = createShapeId();
store.put([{ id, type: 'geo', x: 0, y: 0, props: { w: 100, h: 100 } }]);
console.log(JSON.stringify(store.get(id), null, 2));
