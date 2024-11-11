
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { Menu } from './components/Menu';
import { FirstPersonCamera } from './components/FirstPersonCamera';
import { Sky, Html, PointerLockControls } from '@react-three/drei';
import { useStore } from './hooks/useStore';

function Box() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function App() {
  const mode = useStore((state) => state.gamemode);

  return (
    <>
    
    <Canvas>
      <directionalLight position={[0, 10, 10]} intensity={1} />
      <Box />
      <Sky sunPosition={[100,100,20]}/>
      <ambientLight intensity={0.5} />
      <FirstPersonCamera  />
      <Physics>
        <Player mode={mode}/>
        <Ground />
      </Physics>
    </Canvas>
    <div className='absolute centered cursor'>+</div>
    <Menu />
    </>
  );
}

