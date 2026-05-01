import React, { useEffect } from 'react';
import { Tldraw, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

const EditorController = ({ currentShapes, snapshot, activeSlideId, onSnapshotUpdate }) => {
  const editor = useEditor();

  // Chargement du snapshot ou injection des formes IA
  useEffect(() => {
    if (!editor) return;
    
    try {
      if (snapshot) {
        editor.loadSnapshot(snapshot);
      } else if (currentShapes && currentShapes.length > 0) {
        // 1. Vider le canvas
        const allShapeIds = Array.from(editor.getCurrentPageShapeIds());
        if (allShapeIds.length > 0) {
          editor.deleteShapes(allShapeIds);
        }
        
        // 2. Injecter les nouvelles formes
        editor.createShapes(currentShapes);
        
        // 3. Centrer automatiquement
        setTimeout(() => {
          try {
            editor.zoomToFit({ animation: { duration: 300 } });
          } catch (e) {
            console.error("Erreur lors du zoom:", e);
          }
        }, 150);
      }
    } catch (e) {
      console.error("Erreur lors de la manipulation du canvas:", e);
    }
  }, [editor, currentShapes, snapshot]); // On exécute ceci au montage avec le bon snapshot ou currentShapes

  // Écoute des changements de l'utilisateur pour sauvegarder le snapshot
  useEffect(() => {
    if (!editor || !onSnapshotUpdate) return;
    
    let debounceTimer;
    const handleChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          const snap = editor.getSnapshot();
          onSnapshotUpdate(activeSlideId, snap);
        } catch(e) {}
      }, 500); // Sauvegarde après 500ms d'inactivité
    };

    const cleanup = editor.store.listen(handleChange, { scope: 'document' });
    
    return () => {
      cleanup();
      clearTimeout(debounceTimer);
    };
  }, [editor, activeSlideId, onSnapshotUpdate]);

  return null;
};

const Whiteboard = ({ activeSlideId, currentShapes, snapshot, onSnapshotUpdate }) => {
  return (
    <div className="canvas-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* On utilise `key` pour forcer le remontage lors du changement de slide */}
      <Tldraw key={activeSlideId} autoFocus={false}>
        <EditorController 
          activeSlideId={activeSlideId}
          currentShapes={currentShapes} 
          snapshot={snapshot}
          onSnapshotUpdate={onSnapshotUpdate}
        />
      </Tldraw>
    </div>
  );
};

export default Whiteboard;

