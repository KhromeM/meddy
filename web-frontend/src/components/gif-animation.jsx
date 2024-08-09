import React, { useEffect, useState } from 'react';
import '../styles/gif.css';

export const GifAnimation = () => {
  const [stats, setStats] = useState({
    doubt: 0.347,
    disappointment: 0.318,
    confusion: 0.311,
    anger: 0.221,
    contempt: 0.179,
    surprise: 0.1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        doubt: Math.random(),
        disappointment: Math.random(),
        confusion: Math.random(),
        anger: Math.random(),
        contempt: Math.random(),
        surprise: Math.random()
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="chat-box">
        <div className="user">
          <p>Do you ever feel sad?</p>
          <div className="stats">
            <p>TONE OF VOICE</p>
            <p>Doubt: {stats.doubt.toFixed(3)}</p>
            <p>Disappointment: {stats.disappointment.toFixed(3)}</p>
            <p>Confusion: {stats.confusion.toFixed(3)}</p>
            <p>Anger: {stats.anger.toFixed(3)}</p>
            <p>Contempt: {stats.contempt.toFixed(3)}</p>
            <p>Surprise: {stats.surprise.toFixed(3)}</p>
          </div>
        </div>
        <div className="assistant">
          <p>I don't have feelings or emotions like humans do, but I can understand and respond to human emotions.</p>
        </div>
      </div>
      <div className="video">
        {/* Placeholder for animated video */}
        <img src="path/to/video.png" alt="Animated" className="animated-video" />
      </div>
      <button className="try-demo">TRY DEMO</button>
    </div>
  );
};

export default GifAnimation;
