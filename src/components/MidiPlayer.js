import React, { useRef } from 'react';
import * as Tone from 'tone';
import MIDIFile from 'midifile';

export const MidiPlayer = () => {
    const fileInputRef = useRef();

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const midi = new MIDIFile(arrayBuffer);

                const synth = new Tone.PolySynth(Tone.Synth).toDestination();

                const events = midi.getMidiEvents();
                events.forEach((event) => {
                    if (event.type === 8) { // Note on
                        const time = event.playTime / 1000;
                        const note = Tone.Frequency(event.param1, 'midi').toNote();
                        const duration = event.param2 / 127; // Velocity as duration
                        synth.triggerAttackRelease(note, duration, time);
                    }
                });

                Tone.Transport.start();
            } catch (error) {
                console.error('Error processing MIDI file:', error);
            }
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".mid,.midi,audio/midi,audio/x-midi"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
};