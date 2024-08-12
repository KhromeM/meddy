import React from 'react';

const SpinningLogo = ({ size = 100, outerSpeed = 10, innerSpeed = 8, color = "#FFFFFF" }) => {
  // Calculate scaling factor
  const scale = size / 50;

  // Ensure color is in correct format for SVG
  const strokeColor = color.startsWith('0x') ? `#${color.slice(2)}` : color;

  return (
    <svg
    
      width={size}
      height={size}
      viewBox={`0 0 50 51`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes spin-clockwise {
            100% { transform: rotate(360deg); }
          }
          @keyframes spin-counterclockwise {
            100% { transform: rotate(-360deg); }
          }
          .outer-circle {
            animation: spin-clockwise ${outerSpeed}s linear infinite;
            transform-origin: center;
          }
          .inner-circle {
            animation: spin-counterclockwise ${innerSpeed}s linear infinite;
            transform-origin: center;
            padding-top: 10px;
          }
            margin-left: 10px;
        `}
      </style>
      <g width="50" height="51" viewBox="0 0 50 51" fill="none" xmlns="http://www.w3.org/2000/svg" className='outer-circle'>
        <path d="M47.9965 25C48.0782 29.8359 46.7201 34.5809 44.1063 38.592C41.4926 42.6032 37.7494 45.6866 33.3841 47.4246C29.0188 49.1625 24.2423 49.4709 19.7018 48.3081C15.1612 47.1453 11.0761 44.5673 8 40.9236" stroke={strokeColor} strokeWidth="3" strokeLinecap="round"/>
        <path d="M2.02069 28.0919C1.53117 23.3405 2.51408 18.5534 4.83625 14.3793C7.15842 10.2052 10.7076 6.84578 15.0029 4.75627C19.2982 2.66676 24.132 1.94815 28.8494 2.69778C33.5668 3.44742 37.9397 5.62907 41.3757 8.94715" stroke={strokeColor} strokeWidth="3" strokeLinecap="round"/>
      </g>

      <g width="49" height="50" viewBox="0 0 49 50" fill="none" xmlns="http://www.w3.org/2000/svg" className='inner-circle'>
        <path d="M27.1849 39.8223C24.3427 40.2874 21.4312 39.8342 18.8465 38.5245C16.2619 37.2147 14.1298 35.1121 12.7403 32.5027C11.3509 29.8933 10.7716 26.9039 11.0814 23.9414C11.3911 20.9789 12.5748 18.1872 14.4714 15.9463" stroke={strokeColor} strokeWidth="3" strokeLinecap="round"/>
        <path d="M23.7693 11.06C26.6356 10.7981 29.5103 11.4571 32.002 12.9474C34.4937 14.4378 36.4815 16.687 37.6947 19.389C38.908 22.091 39.2878 25.1145 38.7824 28.048C38.2771 30.9814 36.9112 33.6824 34.8705 35.7833" stroke={strokeColor} strokeWidth="3" strokeLinecap="round"/>
      </g>
    </svg>
  );
};

export default SpinningLogo;