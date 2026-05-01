import React from 'react';

const ProviderSelector = ({ provider, setProvider }) => {
  return (
    <div className="select-wrapper">
      <select 
        className="select-input"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
      >
        <option value="openrouter">OpenRouter</option>
        <option value="openai">OpenAI (GPT-4o)</option>
        <option value="gemini">Google Gemini</option>
        <option value="groq">Groq</option>
      </select>
      <svg className="select-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

export default ProviderSelector;
