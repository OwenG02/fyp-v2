import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { MeshStandardMaterial, Vector3 } from 'three';

export const KeysSynth = ({setKeysSynthPosition}) => {
    const ref = useRef();
    const gltf = useGLTF('/assets/KEYBOARD.gltf');


    useEffect(() => {
        if (ref.current) {
            const position = new Vector3();
            ref.current.getWorldPosition(position);
            setKeysSynthPosition(position);
        }
    }, [setKeysSynthPosition]);
    
    //bug fixing
    //console.log('GLTF:', gltf);
    const { nodes, materials } = gltf;
    if (!nodes || !materials) {
        console.error('Failed to load GLTF model');
        return null;
    }
    //console.log('Nodes:', nodes);
    //console.log('Materials:', materials);
    //end bug fixing

    

    return (

        <group ref={ref} scale={[0.1, 0.1, 0.1]} position={[1, 0.5, 0]} rotation={[Math.PI/2, 0, Math.PI]}>
            <mesh geometry={nodes.KEYBOARD.geometry} material={new MeshStandardMaterial({ color: 'white' })} />
        </group>

       
    );
};

//preload model
useGLTF.preload('/assets/KEYBOARD.gltf');


