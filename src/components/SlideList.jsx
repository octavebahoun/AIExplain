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
          + Nouveau Slide
        </button>
      </div>
    </div>
  );
};

export default SlideList;
