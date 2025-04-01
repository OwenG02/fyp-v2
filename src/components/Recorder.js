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

/*
import { useEffect, useRef } from "react";
import * as Tone from "tone";


const Recorder = ({ synth, isRecording, setIsRecording }) => {
    const recorderRef = useRef(null);
    const gainNodeRef = useRef(null);

    useEffect(() => {
        if (!recorderRef.current) {
            recorderRef.current = new Tone.Recorder();
        }
        if (!gainNodeRef.current) {
            gainNodeRef.current = new Tone.Gain(1);
            gainNodeRef.current.toDestination();
        }

        const recorder = recorderRef.current;
        const gainNode = gainNodeRef.current;

        if (synth) {

            console.log("Instrument type:", instrument);
            synth.disconnect();
            synth.connect(gainNode);
            gainNode.connect(recorder);
        }

        const startRecording = async () => {
            if (Tone.context.state !== "running") {
                await Tone.start();
            }

            if (!synth || !recorder) {
                console.error("Synth or Recorder is not initialized.");
                return;
            }

            try {
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

                // Download file
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
*/
