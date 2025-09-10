import React from 'react';
import logo from '../assets/logo.png';

const rockingAnimation = `
@keyframes rocking {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-5deg);
  }
}
`;

export function Loader() {
  return (
    <>
      <style>{rockingAnimation}</style>
      <img
        src={logo}
        alt="Loading..."
        style={{
          width: '100px',
          animation: 'rocking 3s ease-in-out infinite',
          transformOrigin: 'center bottom'
        }}
      />
    </>
  );
}
