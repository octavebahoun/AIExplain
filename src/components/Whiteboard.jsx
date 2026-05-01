import React from 'react';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

const Whiteboard = ({ activeSlideId }) => {
  return (
    <div className="canvas-container">
      {/* Pour la phase 1, le composant est juste monté. La vraie gestion d'état viendra après. */}
      <Tldraw persistenceKey={`whiteboard-slide-${activeSlideId}`} />
    </div>
  );
};

export default Whiteboard;
