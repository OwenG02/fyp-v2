import { useCallback, useEffect, useState} from "react"
import * as Tone from 'tone';

function actionByKey(key){
    const keys = {
        KeyW: 'moveForward',
        KeyS: 'moveBackward',
        KeyA: 'moveLeft',
        KeyD: 'moveRight',
        Space: 'jump'
    }
    return keys[key]
}

const notes = { 
    'a': 'C4',
    'w': 'C#4',
    's': 'D4',
    'e': 'D#4',
    'd': 'E4',
    'f': 'F4',
    't': 'F#4',
    'g': 'G4',
    'y': 'G#4',
    'h': 'A4',
    'u': 'A#4',
    'j': 'B4',
    'k': 'C5',
}

export const useKeyboard = (mode) => {
    const [action, setActions] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
    })

    const handleKeyDown = useCallback((e) => {
        //new for midi
       if(mode === 'midi'){
            console.log(`Key pressed: ${e.key}`);
            playNote(e.key);
       }else{
		const action = actionByKey(e.code)
		if (action) {
			setActions((prev) => {
				return ({
					...prev,
					[action]: true
				})
			})
		}
    }
	}, [mode])

    //same but set to false
    const handleKeyUp = useCallback((e) => {
        if(mode !== 'midi'){
		const action = actionByKey(e.code)
		if (action) {
			setActions((prev) => {
				return ({
					...prev,
					[action]: false
				})
			})
		}
    }
	}, [mode])

    const playNote = (key) => {
        const synth = new Tone.Synth().toDestination();
        const note = notes[key];
        if (note) {
            console.log(`Playing note: ${note}`);
            synth.triggerAttackRelease(note, '8n');
        }
    };

    useEffect(() => {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);
            //have to remove event listeners
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
            }
        },[handleKeyDown, handleKeyUp])
    return action
}