import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Stats } from "@react-three/drei";
import { pickRandomIntFromInterval, range } from "./utils";
import { Sampler } from "tone";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 14px; background-color: #000000;"
);

console.log(
  "%c http://www.computeremotions.com ",
  "font-size: 12px; background-color: #000000;"
);

export interface Sample {
  index: number;
  sampler: Sampler;
}

const baseUrlChords = `${process.env.PUBLIC_URL}/audio/chords/`;
const baseUrlWhoosh = `${process.env.PUBLIC_URL}/audio/whoosh/`;

export const AUDIO: Sample[][] = [
  [
    {
      index: 0,
      sampler: new Sampler({
        urls: {
          1: "a3.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 1,
      sampler: new Sampler({
        urls: {
          1: "b3.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 2,
      sampler: new Sampler({
        urls: {
          1: "c4.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 3,
      sampler: new Sampler({
        urls: {
          1: "e4.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 4,
      sampler: new Sampler({
        urls: {
          1: "f3.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 5,
      sampler: new Sampler({
        urls: {
          1: "f4.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 6,
      sampler: new Sampler({
        urls: {
          1: "g3.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 7,
      sampler: new Sampler({
        urls: {
          1: "g4.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
    {
      index: 8,
      sampler: new Sampler({
        urls: {
          1: "g32.mp3",
        },
        baseUrl: baseUrlChords,
      }),
    },
  ],
  [
    {
      index: 0,
      sampler: new Sampler({
        urls: {
          1: "whoosh1.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 1,
      sampler: new Sampler({
        urls: {
          1: "whoosh2.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 2,
      sampler: new Sampler({
        urls: {
          1: "whoosh3.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 3,
      sampler: new Sampler({
        urls: {
          1: "whoosh4.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 4,
      sampler: new Sampler({
        urls: {
          1: "whoosh5.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 5,
      sampler: new Sampler({
        urls: {
          1: "whoosh6.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 6,
      sampler: new Sampler({
        urls: {
          1: "whoosh7.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 7,
      sampler: new Sampler({
        urls: {
          1: "whoosh8.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 8,
      sampler: new Sampler({
        urls: {
          1: "whoosh9.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 9,
      sampler: new Sampler({
        urls: {
          1: "whoosh10.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 10,
      sampler: new Sampler({
        urls: {
          1: "whoosh11.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 11,
      sampler: new Sampler({
        urls: {
          1: "whoosh12.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
    {
      index: 12,
      sampler: new Sampler({
        urls: {
          1: "whoosh13.mp3",
        },
        baseUrl: baseUrlWhoosh,
      }),
    },
  ],
];

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
      {/* <Stats /> */}
      <Suspense fallback={null}>
        <Scene canvasRef={canvasRef} />
      </Suspense>
    </Canvas>
  );
};

export default App;
