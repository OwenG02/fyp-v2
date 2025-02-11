import { useEffect, useRef } from "react";
import * as Tone from "tone";

const Recorder = ({ synth, isRecording, setIsRecording }) => {
    const recorderRef = useRef(null);

    useEffect(() => {
        if (!recorderRef.current) {
            recorderRef.current = new Tone.Recorder();
        }
        const recorder = recorderRef.current;

        const startRecording = async () => {
            if (Tone.context.state !== "running") {
                await Tone.start(); // Ensure the AudioContext is running
            }

            if (!synth || !recorder) {
                console.error("Synth or Recorder is not initialized.");
                return;
            }

            try {
                synth.disconnect(); // Avoid multiple connections
                synth.connect(recorder);
                await recorder.start();
                console.log("Recording started...");
            } catch (error) {
                console.error("Error starting recording:", error);
            }
        };

        const stopRecording = async () => {
            if (recorder.state !== "started") {
                console.warn("Recorder was not started.");
                return;
            }

            try {
                const recording = await recorder.stop();
                console.log("Recording stopped...");

                // Create download link
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
        } else {
            stopRecording();
        }

        return () => {
            try {
                synth.disconnect();
                synth.connect(Tone.Destination);
            } catch (error) {
                console.warn("Error during cleanup:", error);
            }
        };
    }, [isRecording, synth, setIsRecording]);

    return null;
};

export default Recorder;

