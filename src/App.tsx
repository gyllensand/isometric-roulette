import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Stats } from "@react-three/drei";
import { pickRandomIntFromInterval, range } from "./utils";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 14px; background-color: #000000;"
);

console.log(
  "%c http://www.computeremotions.com ",
  "font-size: 12px; background-color: #000000;"
);

export const ROW_X = pickRandomIntFromInterval(4, 7);
export const ROW_Y = pickRandomIntFromInterval(4, 7);
export const ROW_Z = pickRandomIntFromInterval(4, 7);
export const TOTAL = ROW_X * ROW_Y * ROW_Z;
const zoom = range(64, 343, 55, 35, TOTAL);

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <Canvas
      ref={canvasRef}
      shadows
      orthographic
      dpr={window.devicePixelRatio}
      camera={{ position: [0, 0, 10], near: 1, far: 15, zoom }}
    >
      <Stats />
      <Suspense fallback={null}>
        <Scene canvasRef={canvasRef} />
      </Suspense>
    </Canvas>
  );
};

export default App;
