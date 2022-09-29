import { Environment, OrbitControls } from "@react-three/drei";
import { extend, useThree } from "@react-three/fiber";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RoundedBoxGeometry } from "three-stdlib/geometries/RoundedBoxGeometry";
import { EffectComposer, SSAO } from "@react-three/postprocessing";
import { start } from "tone";
import Cubes from "./Cubes";
import {
  getRandomNumber,
  getSizeByAspect,
  pickRandomDecimalFromInterval,
  pickRandomHash,
  pickRandomIntFromInterval,
} from "./utils";
import { BG_COLORS, COLORS, INSTRUMENTS } from "./constants";
import { Sample, AUDIO } from "./App";

const perlinNoise3d = require("perlin-noise-3d");

extend({ RoundedBoxGeometry });

export const ROW_X = pickRandomIntFromInterval(4, 7);
export const ROW_Y = pickRandomIntFromInterval(4, 7);
export const ROW_Z = pickRandomIntFromInterval(4, 7);
export const TOTAL = ROW_X * ROW_Y * ROW_Z;

export const instrument = pickRandomHash(INSTRUMENTS);
const internalInstrument = instrument === 0 || instrument === 1 ? 0 : 1;
export const envMapIntensity = pickRandomDecimalFromInterval(0.5, 1);
const ambientLight = pickRandomDecimalFromInterval(0, 0.5);
const bgColor = pickRandomHash(BG_COLORS);
const primaryColor = pickRandomHash(COLORS);
const secondaryColor = pickRandomHash(COLORS);

// @ts-ignore
window.$fxhashFeatures = {
  instrument,
  xRowCount: ROW_X,
  yRowCount: ROW_Y,
  zRowCount: ROW_Z,
  bgColor,
  primaryColor,
  secondaryColor,
};

const noise = new perlinNoise3d();
const p3 =
  (time: number, threshold: number) => (a: number, b: number, c: number) =>
    noise.get(
      Math.abs(((a + 0.5) / (ROW_Z / 2)) * time * threshold),
      Math.abs(((b + 0.5) / (ROW_Y / 2)) * time * threshold),
      Math.abs(((c + 0.5) / (ROW_X / 2)) * time * threshold)
    );

const Scene = ({ canvasRef }: { canvasRef: RefObject<HTMLCanvasElement> }) => {
  const toneInitialized = useRef(false);
  const { aspect, clock } = useThree((state) => ({
    aspect: state.viewport.aspect,
    clock: state.clock,
  }));
  const [lastPlayedSample, setLastPlayedSample] = useState<Sample>();
  const availableChords = useMemo(
    () =>
      AUDIO[internalInstrument].filter(
        ({ index }) => index !== lastPlayedSample?.index
      ),
    [lastPlayedSample]
  );

  const updateCubes = useCallback(
    (count: number): [number, number[][]] => {
      let visible: number[][] = [[], []];

      while (visible[0] && visible[0].filter((o) => o === 1).length < 15) {
        visible = [[], []];

        for (let i = 0; i < 2; i++) {
          const time = clock.getElapsedTime() * (1 + 60 * getRandomNumber());
          const threshold = 0.05 + 0.05 * getRandomNumber();

          for (let z = -ROW_Z / 2; z < ROW_Z / 2; z += 1) {
            for (let y = -ROW_Y / 2; y < ROW_Y / 2; y += 1) {
              for (let x = -ROW_X / 2; x < ROW_X / 2; x += 1) {
                const fn = p3(time, threshold + i);
                const noise = fn(x, y, z) + fn(y, z, x) + fn(z, x, y);
                visible[i].push(
                  noise > 1.5 - threshold && noise < threshold + 1.5 ? 1 : 0
                );
              }
            }
          }
        }
      }

      return [count, visible];
    },
    [clock]
  );

  const [[iterationCount, visible], set] = useState<[number, number[][]]>([
    0,
    [[], []],
  ]);

  useEffect(() => {
    const data = updateCubes(0);
    set(data);
  }, [updateCubes]);

  useEffect(() => {
    if (lastPlayedSample && lastPlayedSample.sampler.loaded) {
      lastPlayedSample.sampler.triggerAttack(
        instrument === 1 ? "G#-1" : "C#-1"
      );
    }
  }, [lastPlayedSample]);

  const onPointerDown = useCallback(async () => {
    if (!toneInitialized.current) {
      await start();
      toneInitialized.current = true;
    }

    const count = iterationCount + 1;
    const data = updateCubes(count);

    set(data);

    const currentSampler = pickRandomHash(availableChords);
    setLastPlayedSample(currentSampler);
  }, [updateCubes, iterationCount, availableChords]);

  useEffect(() => {
    AUDIO[internalInstrument].forEach(({ sampler }) => sampler.toDestination());
  }, []);

  useEffect(() => {
    const ref = canvasRef?.current;

    if (!ref) {
      return;
    }

    ref.addEventListener("pointerdown", onPointerDown);

    return () => {
      ref.removeEventListener("pointerdown", onPointerDown);
    };
  }, [onPointerDown, canvasRef]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <OrbitControls enabled={false} />
      <ambientLight intensity={ambientLight} />
      <pointLight position={[-10, 0, 0]} intensity={3} />
      <pointLight position={[10, 10, 10]} intensity={2} castShadow />
      <Environment preset="studio" />
      <EffectComposer multisampling={0}>
        <SSAO
          samples={31}
          radius={10}
          intensity={18}
          luminanceInfluence={0.1}
          color="#000000"
        />
      </EffectComposer>
      <group
        rotation={[Math.PI / 4, Math.PI / 4, 0]}
        scale={[
          getSizeByAspect(1, aspect),
          getSizeByAspect(1, aspect),
          getSizeByAspect(1, aspect),
        ]}
      >
        <Cubes
          color={primaryColor}
          visible={visible[0]}
          iterationCount={iterationCount}
        />
        <Cubes
          scale={0.25}
          visible={visible[1]}
          color={secondaryColor}
          iterationCount={iterationCount}
        />
      </group>
    </>
  );
};

export default Scene;
