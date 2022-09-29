import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useState } from "react";
import {
  Group,
  InstancedMesh,
  Color,
  Object3D,
  Vector3,
  MathUtils,
} from "three";
import { COLORS } from "./constants";
import { envMapIntensity, ROW_X, ROW_Y, ROW_Z, TOTAL } from "./Scene";
import { pickRandomColorWithTheme } from "./utils";

const Cubes = ({
  scale = 1,
  iterationCount = 0,
  color,
  visible,
}: {
  scale?: number;
  iterationCount: number;
  color: string;
  visible: number[];
}) => {
  const group = useRef<Group>();
  const instance = useRef<InstancedMesh>();
  const tempColor = useMemo(() => new Color(), []);
  const [objects] = useState(() =>
    [...new Array(TOTAL)].map(() => new Object3D())
  );

  const colorArray = useMemo(
    () =>
      Float32Array.from(
        new Array(objects.length)
          .fill(null)
          .flatMap((o, i) =>
            tempColor
              .set(pickRandomColorWithTheme(color, COLORS, COLORS.length * 3))
              .toArray()
          )
      ),
    [tempColor, objects, color]
  );

  const vec = new Vector3();
  useFrame(({ clock }) => {
    if (!group?.current || !instance?.current) {
      return;
    }

    const sin = 1 + Math.sin(clock.elapsedTime * 5) / 20;

    group.current.scale.lerp(vec.setScalar(sin), 0.02);
    group.current.rotation.y = MathUtils.lerp(
      group.current.rotation.y,
      (iterationCount * Math.PI) / 4,
      0.1
    );
    group.current.rotation.z = MathUtils.lerp(
      group.current.rotation.z,
      ((iterationCount % 2) * Math.PI) / 4,
      0.1
    );

    let id = 0;
    for (let z = -ROW_Z / 2; z < ROW_Z / 2; z += 1) {
      for (let y = -ROW_Y / 2; y < ROW_Y / 2; y += 1) {
        for (let x = -ROW_X / 2; x < ROW_X / 2; x += 1) {
          const scale = visible[id];
          objects[id].position.set(x, y, z);
          objects[id].scale.lerp(vec.setScalar(scale), 0.2 - id / TOTAL / 8);
          objects[id].updateMatrix();
          instance.current.setMatrixAt(id, objects[id++].matrix);
        }
      }
    }
    instance.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <instancedMesh
        position={[0.5, 0.5, 0.5]}
        receiveShadow
        castShadow
        ref={instance}
        args={[undefined, undefined, TOTAL]}
      >
        {/*
          // @ts-ignore */}
        <roundedBoxGeometry
          args={[1 * scale, 1 * scale, 1 * scale, 1, 0.075 * scale]}
        >
          {/*
            // @ts-ignore */}
          <instancedBufferAttribute
            attachObject={["attributes", "color"]}
            args={[colorArray, 3]}
          />
          {/*
          // @ts-ignore */}
        </roundedBoxGeometry>
        <meshStandardMaterial
          roughness={0}
          metalness={0}
          vertexColors
          envMapIntensity={envMapIntensity}
        />
      </instancedMesh>
    </group>
  );
};

export default Cubes;
