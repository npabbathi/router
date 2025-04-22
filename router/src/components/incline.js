import React from "react";

const InclineVisual = ({ angle }) => {
  const top = 90 - angle;
  const θ = Math.max(0, Math.min(top, 90));
  const rad = (θ * Math.PI) / 180;

  const baseX = 20;
  const baseY = 90;

  const wallHeight = 100;   
  const hypoLen = 80;      
  const wedgeR = 60;      

  const x2 = baseX + hypoLen * Math.cos(rad);
  const y2 = baseY - hypoLen * Math.sin(rad);

  const arcX = baseX + wedgeR * Math.cos(rad);
  const arcY = baseY - wedgeR * Math.sin(rad);

  return (
    /* chat gpt assisted with the math */
    <svg width="200" height="140" viewBox="0 0 200 80">
      <path
        d={`
          M ${baseX} ${baseY}
          L ${baseX + wedgeR} ${baseY}
          A ${wedgeR} ${wedgeR} 0 0 1 ${arcX} ${arcY}
          Z
        `}
        fill="#EF709D"
      />

      <line x1={baseX} y1={baseY} x2={baseX + 100} y2={baseY}
            stroke="black" strokeWidth="2" />

      <line x1={baseX} y1={baseY} x2={baseX} y2={baseY - wallHeight}
            stroke="black" strokeWidth="2" />

      {θ > 0 && (
        <line x1={baseX} y1={baseY} x2={x2} y2={y2}
              stroke="black" strokeWidth="2" />
      )}

      <text x={baseX + 20} y={baseY - 20} fontSize="12" fill="black">
        {angle}°
      </text>
    </svg>
  );
};

export default InclineVisual;