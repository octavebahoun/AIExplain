import React, { useState, useCallback } from 'react';
import ProviderSelector from './components/ProviderSelector';
import ConceptInput from './components/ConceptInput';
import SlideList from './components/SlideList';
import Whiteboard from './components/Whiteboard';
import Toast from './components/Toast';
import { generateExplanation } from './lib/driverRouter';
import { convertToTldrawShapes } from './lib/shapeBuilder';

function App() {
  const [provider, setProvider] = useState('openai');
  const [concept, setConcept] = useState('');
  
  const [slides, setSlides] = useState([
    { id: '1', title: 'Concept initial', definition: '', shapes: [], snapshot: null }
  ]);
  const [activeSlideId, setActiveSlideId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'error' });

  const activeSlide = slides.find(s => s.id === activeSlideId) || slides[0];

  const handleSnapshotUpdate = useCallback((slideId, snapshot) => {
    setSlides(prev => prev.map(s => s.id === slideId ? { ...s, snapshot } : s));
  }, []);

  const handleExplain = async (conceptToExplain, contextText) => {
    setIsLoading(true);
    setToast({ message: '', type: 'error' });
    try {
      const response = await generateExplanation(provider, conceptToExplain, contextText);
      
      const slideData = response.slides ? response.slides[0] : response;
      const tldrawShapes = convertToTldrawShapes(slideData.shapes || []);
      
      setSlides(prevSlides => prevSlides.map(slide => {
        if (slide.id === activeSlideId) {
          return {
            ...slide,
            title: slideData.title || conceptToExplain,
            definition: response.definition || '',
            shapes: tldrawShapes,
            snapshot: null // On réinitialise le snapshot pour injecter les nouvelles formes
          };
        }
        return slide;
      }));
      setConcept('');
    } catch (err) {
      console.error(err);
      setToast({ message: "Erreur: " + err.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSlide = () => {
    const newId = Date.now().toString();
    setSlides([...slides, { id: newId, title: 'Nouveau concept', definition: '', shapes: [], snapshot: null }]);
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
        
        <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
          {activeSlide.definition && (
            <div className="definition-panel">
              <p>{activeSlide.definition}</p>
            </div>
          )}
          <Whiteboard 
            activeSlideId={activeSlideId} 
            currentShapes={activeSlide.shapes} 
            snapshot={activeSlide.snapshot}
            onSnapshotUpdate={handleSnapshotUpdate}
          />
        </div>
      </main>

      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: '' })} 
      />
    </div>
  );
}

export default App;
