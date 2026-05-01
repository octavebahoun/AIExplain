import React, { useState } from 'react';
import ContextTextarea from './ContextTextarea';

const ConceptInput = ({ concept, setConcept, onExplain, isLoading }) => {
  const [showContext, setShowContext] = useState(false);
  const [context, setContext] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (concept.trim()) {
      onExplain(concept, context);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <form className="topbar-main-row" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="text-input"
            placeholder="Entrez un concept (ex: TCP/IP, La récursivité...)"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={!concept.trim() || isLoading}
          >
            {isLoading ? 'Génération...' : 'Expliquer'}
          </button>
        </div>
      </form>
      
      <button 
        type="button" 
        className="context-toggle"
        onClick={() => setShowContext(!showContext)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {showContext ? (
            <path d="M18 15l-6-6-6 6"/>
          ) : (
            <path d="M6 9l6 6 6-6"/>
          )}
        </svg>
        {showContext ? 'Masquer le contexte' : 'Ajouter un contexte (optionnel)'}
      </button>

      <ContextTextarea 
        isVisible={showContext} 
        context={context}
        setContext={setContext}
      />
    </div>
  );
};

export default ConceptInput;
