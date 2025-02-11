
import React, {useEffect, useState, useRef} from 'react';
import { Canvas} from '@react-three/fiber';
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



export default function App() {
  const mode = useStore((state) => state.gamemode);
  const [playerPosition, setPlayerPosition] = useState(new Vector3());
  const [keysSynthPosition, setKeysSynthPosition] = useState(new Vector3());
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const synthRef = useRef(new Tone.PolySynth(Tone.Synth).toDestination());
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const distance = playerPosition.distanceTo(keysSynthPosition);
    setIsMenuVisible(distance <= 2);
  }, [playerPosition, keysSynthPosition]);

  const { gamemode, recording } = useControls({
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

  return (
    <>
    <Canvas>
      <directionalLight position={[0, 10, 10]} intensity={1} />
      
      <KeysSynth setKeysSynthPosition={setKeysSynthPosition}/>
      <Sky sunPosition={[100,100,20]}/>
      <ambientLight intensity={0.5} />
      <FirstPersonCamera  />
      <Physics>
        <Player mode={mode} setPlayerPosition={setPlayerPosition}/>
        <Ground />
      </Physics>
    </Canvas>
    <div className='absolute centered cursor'>+</div>
    {isMenuVisible && <Menu />}
    {synthRef.current && <Recorder synth={synthRef.current} isRecording={isRecording} setIsRecording={setIsRecording} />}
  
    </>
  );
}

