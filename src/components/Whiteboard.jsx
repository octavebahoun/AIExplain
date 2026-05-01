import React, { useEffect } from 'react';
import { Tldraw, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

// Sous-composant pour accéder à l'instance editor de tldraw
const EditorController = ({ currentShapes }) => {
  const editor = useEditor();

  useEffect(() => {
    if (!editor || !currentShapes) return;
    
    // 1. Vider le canvas
    const allShapeIds = Array.from(editor.getCurrentPageShapeIds());
    if (allShapeIds.length > 0) {
      editor.deleteShapes(allShapeIds);
    }
    
    // 2. Injecter les nouvelles formes
    if (currentShapes.length > 0) {
      editor.createShapes(currentShapes);
      
      // 3. Centrer automatiquement
      setTimeout(() => {
        editor.zoomToFit({ animation: { duration: 300 } });
      }, 50);
    }
  }, [editor, currentShapes]);

  return null;
};

const Whiteboard = ({ activeSlideId, currentShapes }) => {
  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Tldraw persistenceKey={`whiteboard-slide-${activeSlideId}`}>
        <EditorController currentShapes={currentShapes} />
      </Tldraw>
    </div>
  );
};

export default Whiteboard;
