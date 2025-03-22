import { useRef } from "react";
import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Define Custom Shader Material
const VaporwaveSkyMaterial = shaderMaterial(
  { 
    topColor: new THREE.Color("#ff99ff"), // Soft pink starting color
    bottomColor: new THREE.Color("#222266") // Deep navy blue
  },
  `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  varying vec3 vPos;
  uniform vec3 topColor;
  uniform vec3 bottomColor;
  void main() {
    float t = (vPos.y + 1.0) * 0.5;
    gl_FragColor = vec4(mix(bottomColor, topColor, t), 1.0);
  }
  `
);

extend({ VaporwaveSkyMaterial });

export const VaporwaveSky = () => {
    const ref = useRef();

    useFrame(({ clock }) => {
        if (ref.current) {
            const time = clock.elapsedTime * 0.1;

 
            const hueValues = [0, 220 / 360, 280 / 360, 330 / 360]; // Red, Blue, Purple, Pink
            const hueIndex = Math.floor(time % hueValues.length);
            const nextHueIndex = (hueIndex + 1) % hueValues.length;
            
            const mixFactor = time % 1; //smooth transition between hues
            const hue = THREE.MathUtils.lerp(hueValues[hueIndex], hueValues[nextHueIndex], mixFactor);
            
            ref.current.uniforms.topColor.value.setHSL(hue, 0.7, 0.6);
        }
    });

    return (
        <>
            {/* Sky Sphere */}
            <mesh scale={[500, 500, 500]}>
                <sphereGeometry args={[1, 32, 32]} />
                <vaporwaveSkyMaterial ref={ref} side={THREE.BackSide} />
            </mesh>

            {/* Sun */}
            <mesh position={[0, 0, -500]}>
                <sphereGeometry args={[40, 32, 32]} />
                <meshStandardMaterial 
                    emissive={"#ffffaa"} 
                    emissiveIntensity={5} 
                    color={"#ffdd88"} 
                />
            </mesh>

            {/* Sunlight */}
            <pointLight position={[0, 0, -500]} intensity={10} color={"#ffdd88"} />
        </>
    );
};
