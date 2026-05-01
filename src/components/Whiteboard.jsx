import React, { useEffect } from 'react';
import { Tldraw, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

const EditorController = ({ currentShapes, snapshot, activeSlideId, onSnapshotUpdate }) => {
  const editor = useEditor();
  const hasLoadedRef = React.useRef(false);

  // Chargement initial du snapshot ou injection des formes IA
  useEffect(() => {
    if (!editor || hasLoadedRef.current) return;
    
    try {
      if (snapshot) {
        editor.loadSnapshot(snapshot);
        hasLoadedRef.current = true;
      } else if (currentShapes && currentShapes.length > 0) {
        // Vider le canvas au cas où (normalement inutile avec le changement de key)
        const allShapeIds = Array.from(editor.getCurrentPageShapeIds());
        if (allShapeIds.length > 0) {
          editor.deleteShapes(allShapeIds);
        }
        
        editor.createShapes(currentShapes);
        hasLoadedRef.current = true;
        
        setTimeout(() => {
          try {
            editor.zoomToFit({ animation: { duration: 300 } });
          } catch (e) {}
        }, 150);
      }
    } catch (e) {
      console.error("Erreur d'initialisation du canvas:", e);
    }
  }, [editor, currentShapes, snapshot]);

  // Si de nouvelles formes arrivent de l'IA (snapshot est reset à null par App.jsx)
  // On force le rechargement
  useEffect(() => {
    if (snapshot === null && currentShapes && currentShapes.length > 0) {
      hasLoadedRef.current = false;
    }
  }, [snapshot, currentShapes]);

  // Écoute des changements de l'utilisateur pour sauvegarder le snapshot
  useEffect(() => {
    if (!editor || !onSnapshotUpdate) return;
    
    let debounceTimer;
    const handleChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        try {
          // On ne sauvegarde que si on a déjà fini le chargement initial
          if (hasLoadedRef.current) {
            const snap = editor.getSnapshot();
            onSnapshotUpdate(activeSlideId, snap);
          }
        } catch(e) {}
      }, 500);
    };

    const cleanup = editor.store.listen(handleChange, { scope: 'document', source: 'user' });
    
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

