import React from 'react';
import './BarGraph.css';

const BarGraph = () => {
  return (
    <div className="bar-container">
      <div className="bar">
        <div className="bar-title">ChatGPT</div>
        <div className="bar-percentage chatgpt-bar"></div>
      </div>
      <div className="bar">
        <div className="bar-title">Gemini</div>
        <div className="bar-percentage gemini-bar"></div>
      </div>
    </div>
  );
};

export default BarGraph;
