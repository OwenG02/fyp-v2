import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { Menu } from './components/Menu';
import { FirstPersonCamera } from './components/FirstPersonCamera';
import { Sky } from '@react-three/drei';
import { useStore } from './hooks/useStore';
import { KeysSynth } from './components/KeysSynth';
import { MidiPlayer } from './components/MidiPlayer';
import { Vector3 } from 'three';
import Recorder from './components/Recorder';
import { Leva, useControls } from 'leva';
import * as Tone from 'tone';
import { useKeyboard } from './hooks/useKeyboard'; // ✅ Ensure this is imported

export default function App() {
  const mode = useStore((state) => state.gamemode);
  const [playerPosition, setPlayerPosition] = useState(new Vector3());
  const [keysSynthPosition, setKeysSynthPosition] = useState(new Vector3());
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // ✅ Fix: Define isRecording and setIsRecording
  const [isRecording, setIsRecording] = useState(false);

  // ✅ Fix: Properly manage the synth instance
  const synthRef = useRef(null);

  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
  }, []);

  useEffect(() => {
    const distance = playerPosition.distanceTo(keysSynthPosition);
    setIsMenuVisible(distance <= 2);
  }, [playerPosition, keysSynthPosition]);

  // ✅ Fix: Pass the correct recording state to Leva controls
  useControls({
    gamemode: {
      options: ['walk', 'midi'],
      value: mode,
      onChange: (value) => {
        useStore.setState({ gamemode: value });
      },
    },
    recording: {
      value: isRecording,
      onChange: (value) => {
        setIsRecording(value);
      },
    },
  });

  // ✅ Fix: Ensure useKeyboard updates properly when synth changes
  const actions = useKeyboard(mode, synthRef.current);

  return (
    <>
      <Canvas>
        <directionalLight position={[0, 10, 10]} intensity={1} />
        <KeysSynth setKeysSynthPosition={setKeysSynthPosition}/>
        <Sky sunPosition={[100,100,20]}/>
        <ambientLight intensity={0.5} />
        <FirstPersonCamera />
        <Physics>
          <Player mode={mode} setPlayerPosition={setPlayerPosition}/>
          <Ground />
        </Physics>
      </Canvas>
      <div className='absolute centered cursor'>+</div>
      {isMenuVisible && <Menu />}
      
      {/* ✅ Ensure the synth is passed correctly */}
      {synthRef.current && <Recorder synth={synthRef.current} isRecording={isRecording} setIsRecording={setIsRecording} />}
    </>
  );
}


