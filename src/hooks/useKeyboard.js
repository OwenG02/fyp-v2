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


    //initialise synth
    const synthRef = useRef(
        new Tone.Synth({
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.5,
                release: 0.2, // Ensure a valid release time is set
            },
        }).toDestination()
    );
    const activeNotes = useRef(new Set());

    const handleKeyDown = useCallback(
        (e) => {
            if (mode === "midi") {
                const note = notes[e.key];
                if (note && !activeNotes.current.has(note)) {
                    console.log(`Triggering attack for note: ${note}`);
                    synthRef.current.triggerAttack(note,Tone.now());
                    activeNotes.current.add(note);

                    // Debugging: Log active notes
                    console.log("Active Notes after key down:", Array.from(activeNotes.current));
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
                // Debugging: Log state before trying to release
                console.log(`Trying to release note: ${note}`);
                console.log("Active Notes before release:", Array.from(activeNotes.current));
                console.log("Synth state:", synthRef.current.get());
                console.log("Envelope state:", synthRef.current.envelope.get());
    
                // Validate that the note exists and is active
                if (note && activeNotes.current.has(note)) {
                    console.log(`Triggering release for note: ${note}`);
                    
                    try {
                        //debugging - ensure a valid release time
                        console.log(`Release time: ${Tone.now()}`);
                        // Trigger release without passing a time to avoid issues
                        synthRef.current.triggerAttackRelease(note, Tone.now());
                        activeNotes.current.delete(note);

                        // Debugging: Log active notes after release
                        console.log("Active Notes after release:", Array.from(activeNotes.current));
                        console.log("Synth state:", synthRef.current.get());
                        console.log("Envelope state:", synthRef.current.envelope.get());
                    } catch (error) {
                        console.error(`Error releasing note ${note}:`, error);
                    }
                } else if (note) {
                    console.warn(`Attempted to release inactive note: ${note}`);
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
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        const startToneContext = async () => {
            if (Tone.context.state !== "running") {
                await Tone.start();
                console.log("AudioContext started");
            }
        };
        startToneContext();

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Tone.context.state !== "running") {
                console.warn("AudioContext is not running! Attempting to resume...");
                Tone.context.resume();
            } else {
                //console.log("AudioContext is running.");
            }
        }, 1000); // Check every second
    
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const synth = synthRef.current; // Capture the current synth instance
        return () => {
            synth.dispose(); // Dispose of the synth on unmount
        };
    }, []);

    return actions;
};



