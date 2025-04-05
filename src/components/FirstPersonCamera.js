import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

export const FirstPersonCamera = ({}) => {
    const { camera, gl } = useThree();

    return <PointerLockControls args={[camera, gl.domElement]} />;
};




