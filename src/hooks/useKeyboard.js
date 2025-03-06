import { useCallback, useEffect, useState } from "react";
import * as Tone from 'tone';

function actionByKey(key) {
    return {
        KeyW: 'moveForward',
        KeyS: 'moveBackward',
        KeyA: 'moveLeft',
        KeyD: 'moveRight',
        Space: 'jump'
    }[key];
}

// Function to generate notes dynamically based on the current octave
const generateNotes = (octave) => ({
    'a': `C${octave}`,
    'w': `C#${octave}`,
    's': `D${octave}`,
    'e': `D#${octave}`,
    'd': `E${octave}`,
    'f': `F${octave}`,
    't': `F#${octave}`,
    'g': `G${octave}`,
    'y': `G#${octave}`,
    'h': `A${octave}`,
    'u': `A#${octave}`,
    'j': `B${octave}`,
    'k': `C${octave + 1}`, // Move to next octave for the highest note
});

export const useKeyboard = (mode, synth) => {
    const [actions, setActions] = useState({
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
        jump: false,
    });

    const [octave, setOctave] = useState(4);
    const [notes, setNotes] = useState(generateNotes(4));

    // Update notes whenever the octave changes
    useEffect(() => {
        setNotes(generateNotes(octave));
    }, [octave]);

    const resetMovement = useCallback(() => {
        setActions({
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            jump: false,
        });
    }, []);

    useEffect(() => {
        if (mode === 'walk') {
            resetMovement(); // Reset movement keys when switching to walk mode
        }
    }, [mode, resetMovement]);

    const handleKeyDown = useCallback((e) => {
        if (mode === 'midi' && synth) {
            if (e.key === 'z') {
                setOctave((prev) => {
                    const newOctave = Math.max(prev - 1, 1);
                    console.log(`Octave decreased: ${newOctave}`);
                    return newOctave;
                });
                return;
            }
            if (e.key === 'x') {
                setOctave((prev) => {
                    const newOctave = Math.min(prev + 1, 7);
                    console.log(`Octave increased: ${newOctave}`);
                    return newOctave;
                });
                return;
            }

            const note = notes[e.key];
            if (note) {
                console.log(`Playing note: ${note}`);
                synth.triggerAttackRelease(note, '8n');
            }
        } else if (mode === 'walk') {
            const action = actionByKey(e.code);
            if (action) {
                setActions((prev) => ({
                    ...prev,
                    [action]: true,
                }));
            }
        }
    }, [mode, synth, notes]);

    const handleKeyUp = useCallback((e) => {
        if (mode === 'walk') {
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
