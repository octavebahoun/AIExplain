import React, { useState } from 'react';
import ProviderSelector from './components/ProviderSelector';
import ConceptInput from './components/ConceptInput';
import SlideList from './components/SlideList';
import Whiteboard from './components/Whiteboard';

function App() {
  const [provider, setProvider] = useState('openai');
  const [concept, setConcept] = useState('');
  
  // State global mocké pour la Phase 1
  const [slides, setSlides] = useState([
    { id: '1', title: 'Concept initial' }
  ]);
  const [activeSlideId, setActiveSlideId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = (concept, context) => {
    console.log(`Explaining: ${concept} with provider: ${provider}`);
    console.log(`Context: ${context}`);
    // Mock loading state for UI
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleNewSlide = () => {
    const newId = Date.now().toString();
    setSlides([...slides, { id: newId, title: 'Nouveau concept' }]);
    setActiveSlideId(newId);
    setConcept('');
  };

  return (
    <div className="app-container">
      <SlideList 
        slides={slides} 
        activeSlideId={activeSlideId} 
        setActiveSlideId={setActiveSlideId}
        onNewSlide={handleNewSlide}
      />
      
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-main-row">
            <ProviderSelector provider={provider} setProvider={setProvider} />
            <ConceptInput 
              concept={concept} 
              setConcept={setConcept} 
              onExplain={handleExplain}
              isLoading={isLoading}
            />
          </div>
        </header>
        
        <Whiteboard activeSlideId={activeSlideId} />
      </main>
    </div>
  );
}

export default App;
