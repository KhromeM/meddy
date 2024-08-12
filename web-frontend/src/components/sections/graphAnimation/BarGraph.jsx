import React from 'react';
import './graph.css'; // Make sure to create and import the CSS file

const BarGraph = () => {
  return (
    <div className="wrapper">
      <div className="graph-container" >
        <div className="graph-content" >
          <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#333'}}>Performance Comparison</h3>
          <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40">
            {/* Guidelines */}
            <path d="M 10 0 H 90" />
            <path d="M 10 5 H 90" />
            <path d="M 10 10 H 90" />
            <path d="M 10 15 H 90" />
            <path d="M 10 20 H 90" />
            <path d="M 10 25 H 90" />
            <path d="M 10 30 H 90" />

            {/* Percentages */}
            <text x="0" y="2" fontSize="2" fill="#000">100%</text>
            <text x="0" y="12" fontSize="2" fill="#000">75%</text>
            <text x="0" y="22" fontSize="2" fill="#000">50%</text>
            <text x="0" y="32" fontSize="2" fill="#000">25%</text>

            {/* Bars */}
            <line x1="20" y1="30" x2="20" y2="6" className="bar_one" />
            <line x1="60" y1="30" x2="60" y2="24" className="bar_two" />

            {/* Labels */}
            <text x="20" y="35" fontSize="3" fill="#000" textAnchor="middle">Gemini 2m: 82%</text>
            <text x="60" y="35" fontSize="3" fill="#000" textAnchor="middle">GPT-4o 100k: 18%</text>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BarGraph;
