
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { FirstPersonCamera } from './components/FirstPersonCamera';

import { Sky } from '@react-three/drei';

/*function FirstPersonCamera({ movementSpeed = 0.1 }) {
  const cameraRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  // Keyboard controls for movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'KeyW') setMoveForward(true);
      if (e.code === 'KeyS') setMoveBackward(true);
      if (e.code === 'KeyA') setMoveLeft(true);
      if (e.code === 'KeyD') setMoveRight(true);
    };

    const handleKeyUp = (e) => {
      if (e.code === 'KeyW') setMoveForward(false);
      if (e.code === 'KeyS') setMoveBackward(false);
      if (e.code === 'KeyA') setMoveLeft(false);
      if (e.code === 'KeyD') setMoveRight(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const camera = cameraRef.current;
    if (!camera) return;

    // Reset velocity
    velocity.current.set(0, 0, 0);
    
    // Calculate movement direction
    if (moveForward) direction.current.z -= movementSpeed;
    if (moveBackward) direction.current.z += movementSpeed;
    if (moveLeft) direction.current.x -= movementSpeed;
    if (moveRight) direction.current.x += movementSpeed;

    // Update camera position based on movement
    camera.position.x += direction.current.x;
    camera.position.z += direction.current.z;
    console.log(camera.position);
  });

  return <perspectiveCamera ref={cameraRef} position={[0, 1.6, 5]} />;
} */

function Box() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas>
      
      <directionalLight position={[0, 10, 10]} intensity={1} />
      <Box />
      <Sky sunPosition={[100,100,20]}/>
      <ambientLight intensity={0.5} />
      <FirstPersonCamera />
      <Physics>
        <Player />
        <Ground />
      </Physics>
    </Canvas>
  );
}

