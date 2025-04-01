
import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useControls } from 'leva';
import '../index.css';

const WaveformPlayer = () => {
    const [waveSurfer, setWaveSurfer] = useState(null);
    const fileInputRef = useRef();
    const containerRef = useRef();

    //Leva controls
    const { transparency } = useControls("Waveform Player", {
        transparency: { value: 0.65, min: 0, max: 1, step: 0.05 }
    });

    useEffect(() => {
        if (containerRef.current) {
            console.log("Container Width:", containerRef.current.offsetWidth);
            console.log("Container Height:", containerRef.current.offsetHeight);
            const ws = WaveSurfer.create({
                
                container: containerRef.current,
                waveColor: '#ff00ff',
                progressColor: '#00ffff',
                cursorColor: '#ff00ff',
                barWidth: 3,
                height: (containerRef.current.offsetHeight - 20),
                width: (containerRef.current.offsetWidth - 20),
                responsive: true,
                fillParent: true,
            });
            setWaveSurfer(ws);
        }
        return () => waveSurfer?.destroy();
    }, []);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            if (waveSurfer) {
                waveSurfer.loadBlob(file);
            }
        };
    };

    return (
        <div 
            className="waveform-player"
            style={{ background: `rgba(34, 0, 51, ${transparency})` }} 
        >
            <input 
                type="file" 
                accept="audio/wav" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="file-input"
            />
            
            <div ref={containerRef} className="waveform-container"></div>
            
            <button 
                onClick={() => waveSurfer.playPause()} 
                className="play-pause-button"
            >
                Play / Pause
            </button>
        </div>
    );
};

export default WaveformPlayer;

