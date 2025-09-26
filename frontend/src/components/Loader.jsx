import React from "react";
// import loaderVideo from "../assets/full.webm";
import loaderVideo from "../assets/full_V1.webm";
import logo from "../assets/logo.png";

// const rockingAnimation = `
// @keyframes rocking {
//   0%, 100% {
//     transform: rotate(0deg);
//   }
//   25% {
//     transform: rotate(5deg);
//   }
//   50% {
//     transform: rotate(0deg);
//   }
//   75% {
//     transform: rotate(-5deg);
//   }
// }
// `;

// export function Loader() {
//   return (
//     <>
//       <style>{rockingAnimation}</style>
//       <img
//         src={logo}
//         alt="Loading..."
//         style={{
//           width: '100px',
//           animation: 'rocking 3s ease-in-out infinite',
//           transformOrigin: 'center bottom'
//         }}
//       />
//     </>
//   );
// }

export function Loader() {
  return (
    <div
      style={{
        width: "280px",
        height: "280px",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <video
        src={loaderVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "280px",
          height: "auto",
          objectFit: "cover",
          // transform: "translateY(10%)",
        }}
      />
    </div>
  );
}
