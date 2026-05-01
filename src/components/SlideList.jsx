import React from 'react';

const SlideList = ({ slides, activeSlideId, setActiveSlideId, onNewSlide }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">AI Whiteboard</h2>
      </div>
      
      <div className="slide-list">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`slide-item ${activeSlideId === slide.id ? 'active' : ''}`}
            onClick={() => setActiveSlideId(slide.id)}
          >
            <span className="slide-number">{index + 1}</span>
            <span className="slide-name">{slide.title || `Slide ${index + 1}`}</span>
          </button>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <button className="btn-secondary btn-full" onClick={onNewSlide}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau Slide
        </button>
      </div>
    </div>
  );
};

export default SlideList;
