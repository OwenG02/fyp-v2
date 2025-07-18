import { useEffect, useRef } from "react";
import * as Tone from "tone";

document.body.addEventListener('click', async () => {
    // This will resume the Tone.js context and allow audio playback
    await Tone.start();
    console.log("AudioContext resumed.");
});

const Recorder = ({ synth, isRecording, setIsRecording }) => {
    const recorderRef = useRef(null);

    useEffect(() => {
        if (!recorderRef.current) {
            recorderRef.current = new Tone.Recorder();
        }
        const recorder = recorderRef.current;

        const startRecording = async () => {
            if (Tone.context.state !== "running") {
                await Tone.start();
            }

            if (!synth || !recorder) {
                console.error("Synth or Recorder is not initialized.");
                return;
            }

            try {
                synth.disconnect();
                synth.connect(recorder);
                synth.connect(Tone.Destination); //ensure audio is heard while recording
                console.log("Recording started");
                await recorder.start();
            } catch (error) {
                console.error("Error starting recording:", error);
            }
        };

        const stopRecording = async () => {
            if (!recorder || recorder.state !== "started") {
                console.warn("Recorder was not started.");
                return;
            }

            try {
                const recording = await recorder.stop();
                console.log("Recording stopped...");

                //download file
                const url = URL.createObjectURL(recording);
                const a = document.createElement("a");
                a.href = url;
                a.download = "recording.wav";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                setIsRecording(false);
            } catch (error) {
                console.error("Error stopping recording:", error);
            }
        };

        if (isRecording) {
            startRecording();
        }

        return () => {
            if (isRecording) {
                stopRecording();
            }
        };
    }, [isRecording, synth, setIsRecording]);

    return null;
};

export default Recorder;
