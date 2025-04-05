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
import WaveformPlayer from './components/WaveformPlayer';


export default function App() {
  const mode = useStore((state) => state.gamemode);
  const [playerPosition, setPlayerPosition] = useState(new Vector3());
  const [keysSynthPosition, setKeysSynthPosition] = useState(new Vector3());
  const [bassPosition, setBassPosition] = useState(new Vector3());
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isWaveformVisible, setIsWaveformVisible] = useState(false);

  const [audioContext, setAudioContext] = useState(null);
  const [isAudioContextInitialized, setIsAudioContextInitialized] = useState(false);

  const synthRef = useRef(null);
  const bassRef = useRef(null);
  const[activeInstrument, setActiveInstrument] = useState('null');

  // Function to initialize the AudioContext
  const initializeAudioContext = () => {
    if (!audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)({
        latencyHint: 'interactive', // Low latency
        sampleRate: 22050, 
      });
      setAudioContext(context);
      setIsAudioContextInitialized(true);
      console.log("AudioContext initialized");
    }
  };

  /*
  // Function to resume the AudioContext if suspended
  const resumeAudioContext = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
      console.log("AudioContext resumed");
    }
  };
  */

  useEffect(() => {
    // Add event listener to start AudioContext on any user interaction
    const startAudioOnUserInput = () => {
      initializeAudioContext();
      document.removeEventListener('click', startAudioOnUserInput); 
      document.removeEventListener('keydown', startAudioOnUserInput); 
    };

    document.addEventListener('click', startAudioOnUserInput);
    document.addEventListener('keydown', startAudioOnUserInput);

    // Listen for MIDI input to act as a user gesture for audio context initialization
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then((midiAccess) => {
        midiAccess.inputs.forEach((input) => {
          input.onmidimessage = () => {
            initializeAudioContext(); 
          };
        });
      });
    }

    return () => {
      document.removeEventListener('click', startAudioOnUserInput);
      document.removeEventListener('keydown', startAudioOnUserInput);
    };
  }, [audioContext]);

  
  /*pointer lock error handling
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const lockPointer = async () => {
    try {
      await document.getElementById('canvas').requestPointerLock();
    } catch (error) {
      console.warn('Pointer lock request failed:', error);
    }
  };
  
  const handlePointerLockChange = () => {
    if (document.pointerLockElement) {
      setIsPointerLocked(true);
    } else {
      setIsPointerLocked(false);
      lockPointer();
    }
  };
  
  const handlePointerLockError = (event) => {
    console.warn('Pointer lock error caught:', event);
    setIsPointerLocked(false);
  
    setTimeout(() => {
      lockPointer();
    }, 1000); 
  };
  
  useEffect(() => {

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);
  

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
    };
  }, []);

  //end pointer lock
  */

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

  //Leva Synth & Bass parameter controls
  const synthControls = useControls('Synth', {
    oscillatorType: {
      options: ['sine', 'square', 'triangle', 'sawtooth'],
      value: 'sine',
      onChange: (v) => {
        if (synthRef.current) {
          synthRef.current.set({ oscillator: { type: v } });
        }
      },
    },
    attack: {
      value: 0.01,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (synthRef.current) {
          synthRef.current.set({ envelope: { ...synthRef.current.get().envelope, attack: v } });
        }
      },
    },
    decay: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (synthRef.current) {
          synthRef.current.set({ envelope: { ...synthRef.current.get().envelope, decay: v } });
        }
      },
    },
    sustain: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (synthRef.current) {
          synthRef.current.set({ envelope: { ...synthRef.current.get().envelope, sustain: v } });
        }
      },
    },
    release: {
      value: 1.0,
      min: 0,
      max: 3,
      step: 0.1,
      onChange: (v) => {
        if (synthRef.current) {
          synthRef.current.set({ envelope: { ...synthRef.current.get().envelope, release: v } });
        }
      },
    },
  });

  const bassControls = useControls('Bass', {
    oscillatorType: {
      options: ['sine', 'square', 'triangle', 'sawtooth'],
      value: 'square',
      onChange: (v) => {
        if (bassRef.current) {
          bassRef.current.set({ oscillator: { type: v } });
        }
      },
    },
    filterQ: {
      value: 4,
      min: 0,
      max: 20,
      step: 0.1,
      onChange: (v) => {
        if (bassRef.current) {
          bassRef.current.set({ filter: { Q: v } });
        }
      },
    },
    attack: {
      value: 0.01,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (bassRef.current) {
          bassRef.current.set({ envelope: { ...bassRef.current.get().envelope, attack: v } });
        }
      },
    },
    decay: {
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (bassRef.current) {
          bassRef.current.set({ envelope: { ...bassRef.current.get().envelope, decay: v } });
        }
      },
    },
    sustain: {
      value: 0.7,
      min: 0,
      max: 1,
      step: 0.01,
      onChange: (v) => {
        if (bassRef.current) {
          bassRef.current.set({ envelope: { ...bassRef.current.get().envelope, sustain: v } });
        }
      },
    },
    release: {
      value: 1.2,
      min: 0,
      max: 3,
      step: 0.1,
      onChange: (v) => {
        if (bassRef.current) {
          bassRef.current.set({ envelope: { ...bassRef.current.get().envelope, release: v } });
        }
      },
    },
  });
  
  

  

  //send state to Leva
  useControls({
    recording: {
      label: 'Record',
      value: isRecording,
      onChange: (value) => {
        setIsRecording(value);
      },
    },
    showWaveform: {
      label: 'Track Editor',
      value: isWaveformVisible,
      onChange: (value) => {
        setIsWaveformVisible(value);
      },
    }
    
  
  });

  //ensure useKeyboard gets correct updates for mode and synth
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
      
      {isWaveformVisible && <WaveformPlayer />}
      {isMenuVisible && <Menu />}
      {activeInstrument && <Recorder synth={activeInstrument} isRecording={isRecording} setIsRecording={setIsRecording} />}
    </>
  );
}

