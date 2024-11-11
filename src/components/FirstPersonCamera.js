import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const FirstPersonCamera = ({ isMenuVisible }) => {
    const { camera, gl } = useThree();

    return <PointerLockControls args={[camera, gl.domElement]} />;
};
