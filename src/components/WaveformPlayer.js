
/*import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useControls } from 'leva';
import '../index.css';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

const WaveformPlayer = () => {
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [loopRegion, setLoopRegion] = useState(null);
    const fileInputRef = useRef();
    const containerRef = useRef();

    const regions = RegionsPlugin.create();

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
                plugins: [
                    regions,
                ],
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

    //looping functionality
    // Give regions a random color when they are created
    const random = (min, max) => Math.random() * (max - min) + min
    const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`

    // Create some regions at specific time ranges
    ws.on('decode', () => {
    // Regions
    regions.addRegion({
        start: 0,
        end: 8,
        content: 'Resize me',
        color: randomColor(),
        drag: false,
        resize: true,
    })
    
    })

    regions.enableDragSelection({
    color: 'rgba(255, 0, 0, 0.1)',
    })

    regions.on('region-updated', (region) => {
    console.log('Updated region', region)
    })

    // Loop a region on click
    let loop = true
    // Toggle looping with a checkbox
    document.querySelector('input[type="checkbox"]').onclick = (e) => {
    loop = e.target.checked
    }

    {
    let activeRegion = null
    regions.on('region-in', (region) => {
        console.log('region-in', region)
        activeRegion = region
    })
    regions.on('region-out', (region) => {
        console.log('region-out', region)
        if (activeRegion === region) {
        if (loop) {
            region.play()
        } else {
            activeRegion = null
        }
        }
    })
    regions.on('region-clicked', (region, e) => {
        e.stopPropagation() // prevent triggering a click on the waveform
        activeRegion = region
        region.play(true)
        region.setOptions({ color: randomColor() })
    })
    // Reset the active region when the user clicks anywhere in the waveform
    ws.on('interaction', () => {
        activeRegion = null
    })
    }

    // Update the zoom level on slider change
    ws.once('decode', () => {
    document.querySelector('input[type="range"]').oninput = (e) => {
        const minPxPerSec = Number(e.target.value)
        ws.zoom(minPxPerSec)
    }
    })

    
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
            <label>
                <input type="checkbox" checked="${loop}" />
                Loop regions
            </label>

            <label>
                Zoom: <input type="range" min="10" max="1000" value="10" />
            </label>
        </div>
    );
};

export default WaveformPlayer;
*/
import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useControls } from 'leva';
import '../index.css';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';

const WaveformPlayer = () => {
    const [waveSurfer, setWaveSurfer] = useState(null);
    const [loopRegion, setLoopRegion] = useState(null);
    const fileInputRef = useRef();
    const containerRef = useRef();

    const regions = RegionsPlugin.create();

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
                plugins: [
                    regions,
                ],
            });
            
            // Set up event handlers inside useEffect where ws is defined
            
            // Create some regions at specific time ranges
            ws.on('decode', () => {
                // Regions
                regions.addRegion({
                    start: 0,
                    end: 8,
                    content: 'Resize me',
                    color: randomColor(),
                    drag: false,
                    resize: true,
                });
            });
            
            let activeRegion = null;
            regions.on('region-in', (region) => {
                console.log('region-in', region);
                activeRegion = region;
            });
            
            regions.on('region-out', (region) => {
                console.log('region-out', region);
                if (activeRegion === region) {
                    if (loop) {
                        region.play();
                    } else {
                        activeRegion = null;
                    }
                }
            });
            
            regions.on('region-clicked', (region, e) => {
                e.stopPropagation(); // prevent triggering a click on the waveform
                activeRegion = region;
                region.play(true);
                region.setOptions({ color: randomColor() });
            });
            
            // Reset the active region when the user clicks anywhere in the waveform
            ws.on('interaction', () => {
                activeRegion = null;
            });
            
            // Update the zoom level on slider change
            ws.once('decode', () => {
                document.querySelector('input[type="range"]').oninput = (e) => {
                    const minPxPerSec = Number(e.target.value);
                    ws.zoom(minPxPerSec);
                };
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

    //looping functionality
    // Give regions a random color when they are created
    const random = (min, max) => Math.random() * (max - min) + min;
    const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`;

    // Toggle looping with a checkbox - this needs to be defined outside useEffect
    let loop = true;
    
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
                onClick={() => waveSurfer?.playPause()} 
                className="play-pause-button"
            >
                Play / Pause
            </button>
            <label>
                <input 
                    type="checkbox" 
                    defaultChecked={loop} 
                    onChange={(e) => {
                        loop = e.target.checked;
                    }}
                />
                Loop regions
            </label>

            <label>
                Zoom: <input type="range" min="10" max="1000" defaultValue="10" />
            </label>
        </div>
    );
};

export default WaveformPlayer;
