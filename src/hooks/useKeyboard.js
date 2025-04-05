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
    'k': `C${octave + 1}`,
    'o': `C#${octave + 1}`,
    'l': `D${octave + 1}`,
    'p': `D#${octave + 1}`,
});

export const useKeyboard = (mode, instrument,activeInstrument) => {
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

    // Update octave when activeInstrument changes
    useEffect(() => {
        if (activeInstrument) {
            // Change octave based on instrument type
            setOctave(activeInstrument === 'bass' ? 2 : 4);
        }
    }, [activeInstrument]);

    //this fixes some bug where the player would keep moving after switching gamamodes
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
        if (mode === 'midi' && instrument) {
            if (e.key === 'z') {
                setOctave((prev) => {
                    const newOctave = Math.max(prev - 1, 1);
                    return newOctave;
                });
                return;
            }
            if (e.key === 'x') {
                setOctave((prev) => {
                    const newOctave = Math.min(prev + 1, 7);
                    return newOctave;
                });
                return;
            }

            const note = notes[e.key];
            if (note) {
                console.log(`${note}`);
                instrument.triggerAttackRelease(note, '8n');
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
    }, [mode, instrument, notes]);

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
    }, [mode, instrument, notes]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // MIDI Input Handling
    useEffect(() => {
        if (!navigator.requestMIDIAccess) {
            console.warn('Web MIDI API is not supported in this browser.');
            return;
        }
    
        let midiAccess = null;
    
        const midiNoteToPitch = (midiNote) => {
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const octave = Math.floor(midiNote / 12) - 1;  // MIDI octaves start from -1
            const note = noteNames[midiNote % 12];
            return `${note}${octave}`;
        };
    
        const handleMIDIMessage = (event) => {
            const [status, note, velocity] = event.data;
    
            if (status === 144 && velocity > 0) { // MIDI Note On
                const noteName = midiNoteToPitch(note); // Convert MIDI note number to note name
                console.log(`MIDI Note On: ${noteName}`);
    
                if (mode === 'midi' && instrument) {
                    instrument.triggerAttackRelease(noteName, '8n'); // Play correct note
                }
            } else if (status === 128 || (status === 144 && velocity === 0)) { // MIDI Note Off
                console.log(`MIDI Note Off: ${midiNoteToPitch(note)}`);
            }
        };
    
        navigator.requestMIDIAccess().then((access) => {
            midiAccess = access;
            for (let input of midiAccess.inputs.values()) {
                input.onmidimessage = handleMIDIMessage;
            }
        }).catch((err) => console.error('MIDI access failed:', err));
    
        return () => {
            if (midiAccess) {
                for (let input of midiAccess.inputs.values()) {
                    input.onmidimessage = null;
                }
            }
        };
    }, [mode, instrument]);

    return actions;
}
export default useKeyboard;