import React from 'react';

const ContextTextarea = ({ isVisible, context, setContext }) => {
  if (!isVisible) return null;

  // Estimation grossière des tokens: ~4 caractères par token en moyenne
  const tokenCount = Math.floor(context.length / 4);

  return (
    <div className="context-container">
      <textarea
        className="context-textarea"
        placeholder="Collez ici un cours, article ou documentation sur lequel l'IA doit se baser prioritairement..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <div className="token-counter">
        ~{tokenCount} / 8000 tokens
      </div>
    </div>
  );
};

export default ContextTextarea;
