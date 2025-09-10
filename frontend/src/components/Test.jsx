import React, { useEffect, useState } from "react";

const Shape = ({ className = "", style = {} }) => (
  <div
    className={`w-[10rem] h-[10rem] bg-[var(--color-secondary)] ${className}`}
    style={style}
  />
);

const Test = () => {
  const [phase, setPhase] = useState("start"); // "start", "split", "merge"

  useEffect(() => {
    // Cycle phases: start -> split -> merge -> start ...
    const cycle = () => {
      setPhase("split");
      setTimeout(() => {
        setPhase("merge");
      }, 3000); // split phase duration
      setTimeout(() => {
        setPhase("start");
      }, 6000); // merge phase duration
    };
    cycle();
    const interval = setInterval(cycle, 6000);
    return () => clearInterval(interval);
  }, []);

  // Common styles for all shapes
  const baseStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "10rem",
    height: "10rem",
    backgroundColor: "var(--color-secondary)",
    transition: "all 1.5s ease-in-out",
  };

  // Positions and border-radius for each phase and shape
  // Coordinates are relative to center (0,0)
  // Adjust these values to match your logo layout visually

  // Phase: start (all shapes overlap center circle)
  const startStyle = {
    transform: "translate(-50%, -50%) translate(0, 0)",
    borderRadius: "9999px", // full circle
  };

  // Phase: split (shapes move to their positions and morph border-radius)
  const splitStyles = [
    {
      // Circle (shape 1)
      transform: "translate(-50%, -50%) translate(0, 0)",
      borderRadius: "9999px",
    },
    {
      // Bottom-left corner rounded-bl-full (shape 2)
      transform: "translate(-50%, -50%) translate(-120px, 0)",
      borderRadius: "0 0 9999px 0",
    },
    {
      // Bottom-right corner rounded-br-full (shape 3)
      transform: "translate(-50%, -50%) translate(120px, 0)",
      borderRadius: "0 0 0 9999px",
    },
    {
      // Diagonal shape rounded-tl-full rounded-br-full (shape 4)
      transform: "translate(-50%, -50%) translate(-60px, 100px)",
      borderRadius: "9999px 0 9999px 0",
    },
    {
      // Diagonal shape rotated 90deg (shape 5)
      transform: "translate(-50%, -50%) translate(60px, 100px) rotate(90deg)",
      borderRadius: "9999px 0 9999px 0",
    },
  ];

  // Phase: merge (all shapes move up and become circles again, overlapping)
  const mergeStyles = [
    {
      transform: "translate(-50%, -50%) translate(0, -120px)",
      borderRadius: "9999px",
    },
    {
      transform: "translate(-50%, -50%) translate(0, -120px)",
      borderRadius: "9999px",
    },
    {
      transform: "translate(-50%, -50%) translate(0, -120px)",
      borderRadius: "9999px",
    },
    {
      transform: "translate(-50%, -50%) translate(0, -120px)",
      borderRadius: "9999px",
    },
    {
      transform: "translate(-50%, -50%) translate(0, -120px)",
      borderRadius: "9999px",
    },
  ];

  // Select styles based on phase
  const styles =
    phase === "start"
      ? Array(5).fill(startStyle)
      : phase === "split"
      ? splitStyles
      : mergeStyles;

  return (
    <>
      <style>{`
        :root {
          --color-secondary: #4ade80;
        }
        .container {
          position: relative;
          width: 320px;
          height: 320px;
          margin: 40px auto;
        }
      `}</style>

      <div className="container">
        <Shape
          className="rounded-full"
          style={{ ...baseStyle, ...styles[0] }}
        />
        <Shape
          className="rounded-bl-full"
          style={{ ...baseStyle, ...styles[1] }}
        />
        <Shape
          className="rounded-br-full"
          style={{ ...baseStyle, ...styles[2] }}
        />
        <Shape
          className="rounded-tl-full rounded-br-full"
          style={{ ...baseStyle, ...styles[3] }}
        />
        <Shape
          className="rounded-tl-full rounded-br-full rotate-90"
          style={{ ...baseStyle, ...styles[4] }}
        />
      </div>
    </>
  );
};

export default Test;
