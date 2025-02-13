import { useCallback, useEffect, useState } from "react";
import * as Tone from 'tone';

function actionByKey(key) {
    const keys = {
        KeyW: 'moveForward',
        KeyS: 'moveBackward',
        KeyA: 'moveLeft',
        KeyD: 'moveRight',
        Space: 'jump'
    };
    return keys[key];
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
};

export const useKeyboard = (mode, synth) => {
    const [actions, setActions] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
    });

    const handleKeyDown = useCallback((e) => {
        if (mode === 'midi' && synth) {
            const note = notes[e.key];
            if (note) {
                console.log(`Playing note: ${note}`);
                synth.triggerAttackRelease(note, '8n');
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
    }, [mode, synth]);

    const handleKeyUp = useCallback((e) => {
        if (mode !== 'midi') {
            const action = actionByKey(e.code);
            if (action) {
                setActions((prev) => ({
                    ...prev,
                    [action]: false,
                }));
            }
        }
    }, [mode]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return actions;
};




