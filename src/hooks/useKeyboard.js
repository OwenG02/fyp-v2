/*
import { useCallback, useEffect, useState, useRef } from "react";
import * as Tone from "tone";

function actionByKey(key) {
    const keys = {
        KeyW: "moveForward",
        KeyS: "moveBackward",
        KeyA: "moveLeft",
        KeyD: "moveRight",
        Space: "jump",
    };
    return keys[key];
}

const notes = {
    a: "C4",
    w: "C#4",
    s: "D4",
    e: "D#4",
    d: "E4",
    f: "F4",
    t: "F#4",
    g: "G4",
    y: "G#4",
    h: "A4",
    u: "A#4",
    j: "B4",
    k: "C5",
};

export const useKeyboard = (mode) => {
    const [actions, setActions] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
    });

    const synthRef = useRef(
        new Tone.PolySynth({
            envelope: {
                maxPolyphony: 8,
                volume: 10,
            },
        }).toDestination()
    );

    Tone.getContext().latencyHint="interactive"

    
    const activeNotes = useRef(new Set()); // Track active notes

    useEffect(() => {
        const synth = synthRef.current;

        return () => {
            try {
                if (synth) {
                    synth.releaseAll();
                }
            } catch (error) {
                console.error("Error releasing notes during cleanup:", error);
            }
            synth.dispose();
        };
    }, []);

    const handleModeChange = useCallback(() => {
        if (mode !== "midi") {
            try {
                activeNotes.current.forEach((note) => {
                    synthRef.current.triggerRelease(note, Tone.now());
                });
                activeNotes.current.clear();
            } catch (error) {
                console.error("Error releasing notes on mode change:", error);
            }
        }
    }, [mode]);

    useEffect(() => {
        handleModeChange();
    }, [mode, handleModeChange]);

    const handleKeyDown = useCallback(
        (e) => {
            if (mode === "midi") {
                const note = notes[e.key];
                if (note && !activeNotes.current.has(note)) {
                    try {
                        console.log(`Playing note: ${note}`);
                        synthRef.current.triggerAttack(note, Tone.now());
                        activeNotes.current.add(note); // Mark note as active
                    } catch (error) {
                        console.error(`Error playing note ${note}:`, error);
                    }
                }
            } else {
                const action = actionByKey(e.code);
                if (action) {
                    setActions((prev) => ({
                        ...prev,
                        [action]: true,
                    }));
                }
            }
        },
        [mode]
    );

    const handleKeyUp = useCallback(
        (e) => {
            if (mode === "midi") {
                const note = notes[e.key];
                if (note && activeNotes.current.has(note)) {
                    try {
                        console.log(`Releasing note: ${note}`);
                        synthRef.current.triggerRelease(note, Tone.now());
          
                        activeNotes.current.delete(note); // Remove note from active set
                    } catch (error) {
                        console.error(`Error releasing note ${note}:`, error);
                    }
                }
            } else {
                const action = actionByKey(e.code);
                if (action) {
                    setActions((prev) => ({
                        ...prev,
                        [action]: false,
                    }));
                }
            }
        },
        [mode]
    );

    useEffect(() => {
        const handleKeyDownEvent = (e) => {
            handleKeyDown(e);
        };
        const handleKeyUpEvent = (e) => {
            handleKeyUp(e);
        };

        window.addEventListener("keydown", handleKeyDownEvent);
        window.addEventListener("keyup", handleKeyUpEvent);

        return () => {
            window.removeEventListener("keydown", handleKeyDownEvent);
            window.removeEventListener("keyup", handleKeyUpEvent);
        };
    }, [handleKeyDown, handleKeyUp]);

    return actions;
};
*/


//this hook controls the keyboard inputs in different gamemodes 'walk' & 'midi'
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




