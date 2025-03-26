import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { Menu } from './components/Menu';
import { FirstPersonCamera } from './components/FirstPersonCamera';
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

export default function App() {
  const mode = useStore((state) => state.gamemode);
  const [playerPosition, setPlayerPosition] = useState(new Vector3());
  const [keysSynthPosition, setKeysSynthPosition] = useState(new Vector3());
  const [bassPosition, setBassPosition] = useState(new Vector3());
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const synthRef = useRef(null);

  //new
  const bassRef = useRef(null);
  const[activeInstrument, setActiveInstrument] = useState('null');


  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    }
    if (!bassRef.current) {
      bassRef.current = new Tone.MonoSynth({
        oscillator: { type: "square" },
        filter: { Q: 4, type: "lowpass", rolloff: -24 },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 1.2 },
      }).toDestination();
    }
  }, []);

  //check if player is near synth or bass
  useEffect(() => {
    const distanceToKeys = playerPosition.distanceTo(keysSynthPosition);
    const distanceToBass = playerPosition.distanceTo(bassPosition);
  
    setIsMenuVisible(distanceToKeys <= 2 || distanceToBass <= 2);
    if (mode === 'midi') {
      if (distanceToKeys <= 2) {
        setActiveInstrument(synthRef.current);
      } else if (distanceToBass <= 2) {
        setActiveInstrument(bassRef.current);
      } else {
        setActiveInstrument(null);
      }
    } else {
      setActiveInstrument(null);
    }
  }, [mode, playerPosition, keysSynthPosition, bassPosition]);

  

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
    
  
  });


  const midiPlayerRef = useRef(null);
  //ensure useKeyboard gets correct updates for mode and synth
  //const actions = useKeyboard(mode, activeInstrument);
  const actions = useKeyboard(mode, activeInstrument, activeInstrument ? (activeInstrument === synthRef.current ? 'synth' : 'bass') : null);


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
      {activeInstrument && <Recorder synth={activeInstrument} isRecording={isRecording} setIsRecording={setIsRecording} />}
    </>
  );
}