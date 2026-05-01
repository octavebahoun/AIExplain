import { createPresenceStateDerivation, createTLStore, defaultShapeUtils } from '@tldraw/tldraw';

const store = createTLStore({ shapeUtils: defaultShapeUtils });
store.put([{
  id: 'shape:test',
  type: 'text',
  x: 0,
  y: 0,
  props: { richText: undefined } // Let store fill defaults maybe? Or let's see default props.
}]);
console.log(store.get('shape:test'));
