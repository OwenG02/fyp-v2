
import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial, Vector3 } from 'three';

export const Bass = ({ setBassPosition }) => {
    const ref = useRef();
    const gltf = useGLTF('/assets/bass_guitar.gltf');

    useEffect(() => {
        if (ref.current) {
            const position = new Vector3();
            ref.current.getWorldPosition(position);
            setBassPosition(position);
        }
    }, [setBassPosition]);

    //debugging: Log loaded GLTF data
    //console.log('GLTF:', gltf);
    //console.log('Available nodes:', Object.keys(gltf.nodes));

    // Ensure the correct node name is used based on the logged output
    const { nodes } = gltf;
    const bassMesh = nodes['Fender_Precision_Bass']; 

    if (!bassMesh || !bassMesh.geometry) {
        console.error('Bass model geometry is missing or incorrect');
        return null;
    }

    return (
        <group ref={ref} scale={[0.8, 0.8, 0.8]} position={[5, 1, 1]} rotation={[Math.PI/8 , 0, Math.PI/2]}>
            <mesh geometry={bassMesh.geometry} material={new MeshStandardMaterial({ color: 'white' })} />
        </group>
    );
};

//preload model
useGLTF.preload('/assets/bass_guitar.gltf');
