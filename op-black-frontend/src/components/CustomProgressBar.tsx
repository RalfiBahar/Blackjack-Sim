// src/components/CustomProgressBar.tsx
import React from "react";

const CustomProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const progressStyle = {
    width: `${progress}%`,
    backgroundColor: "#4caf50",
    height: "100%",
    borderRadius: "inherit",
    textAlign: "center" as "center",
    lineHeight: "30px",
    color: "white",
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ddd",
        borderRadius: "5px",
        height: "30px",
      }}
    >
      <div style={progressStyle}>{progress.toFixed(2)}%</div>
    </div>
  );
};

export default CustomProgressBar;
