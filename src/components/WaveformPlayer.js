import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WaveformPlayer = () => {
    const [waveSurfer, setWaveSurfer] = useState(null);
    const fileInputRef = useRef();
    const containerRef = useRef();

    useEffect(() => {
        if (containerRef.current) {
            const ws = WaveSurfer.create({
                container: containerRef.current,
                waveColor: '#fff',
                progressColor: '#ff00ff',
                cursorColor: '#ff00ff',
                barWidth: 2,
                height: 100,
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
        // Ensure this is rendered outside the Canvas
        <div style={{ position: 'absolute', top: 10, left: 10, width: '300px', background: '#222', padding: '10px', borderRadius: '5px' }}>
            <input type="file" accept="audio/wav" ref={fileInputRef} onChange={handleFileChange} />
            <div ref={containerRef}></div>
            <button onClick={() => waveSurfer.playPause()}>Play / Pause</button>
        </div>
    );
};

export default WaveformPlayer;
