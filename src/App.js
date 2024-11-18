
import React, {useEffect} from 'react';
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
 /* const toggleMenuVisibility = useStore((state) => state.toggleMenuVisibility);
  const isMenuVisible = useStore((state) => state.isMenuVisible);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        console.log('escape key pressed');
        toggleMenuVisibility();
        document.body.style.cursor = document.body.style.cursor === 'default' ? 'none' : 'default';
        console.log('menu toggled');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleMenuVisibility, isMenuVisible]);
*/

  return (
    <>
    
    <Canvas>
      <directionalLight position={[0, 10, 10]} intensity={1} />
      
      <KeysSynth />
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
    <MidiPlayer />
    </>
  );
}

