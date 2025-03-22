import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { Menu } from './components/Menu';
import { FirstPersonCamera } from './components/FirstPersonCamera';
//import { Sky } from '@react-three/drei';
import { VaporwaveSky } from './components/VaporwaveSky';
import { useStore } from './hooks/useStore';
import { KeysSynth } from './components/KeysSynth';
import { Bass } from './components/Bass';
import { Vector3 } from 'three';
import Recorder from './components/Recorder';
import { Leva, useControls } from 'leva';
import * as Tone from 'tone';
import { useKeyboard } from './hooks/useKeyboard'; 
import { MidiPlayer } from './components/MidiPlayer';

//import { SettingsMenu } from './components/SettingsMenu';


export default function App() {
  const mode = useStore((state) => state.gamemode);
  const [playerPosition, setPlayerPosition] = useState(new Vector3());
  const [keysSynthPosition, setKeysSynthPosition] = useState(new Vector3());
  const [bassPosition, setBassPosition] = useState(new Vector3());
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const synthRef = useRef(null);

  //const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
  }, []);

  useEffect(() => {
    const distance = playerPosition.distanceTo(keysSynthPosition);
    setIsMenuVisible(distance <= 2);
  }, [playerPosition, keysSynthPosition]);

  //send state to Leva
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
    midiPlayback: {
      label: "MIDI Playback",
      value: false,
      onChange: (value) => {
        if (value) {
          midiPlayerRef.current?.start();
        } else {
          midiPlayerRef.current?.stop();
        }
      },
    },
  });

  const midiPlayerRef = useRef(null);
  //ensure useKeyboard gets correct updates for mode and synth
  const actions = useKeyboard(mode, synthRef.current);

  return (
    <>
      <Canvas>
        <directionalLight position={[0, 10, 10]} intensity={1} />
        
        <VaporwaveSky />
        <ambientLight intensity={0.7} />
        <FirstPersonCamera />
        <Physics>
          <Player mode={mode} setPlayerPosition={setPlayerPosition}/>
          <Ground />
          <KeysSynth setKeysSynthPosition={setKeysSynthPosition}/>
          <Bass setBassPosition={setBassPosition}/>

        </Physics>
      </Canvas>
      
      <div className='absolute centered cursor'>+</div>
      {isMenuVisible && <Menu />}
      {synthRef.current && <Recorder synth={synthRef.current} isRecording={isRecording} setIsRecording={setIsRecording} />}
    </>
  );
}

//<Sky sunPosition={[100,100,20]}/>
