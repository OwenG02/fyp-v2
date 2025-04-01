import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";

export const FirstPersonCamera = ({}) => {
    const { camera, gl } = useThree();

    return <PointerLockControls args={[camera, gl.domElement]} />;
};


/*export const FirstPersonCamera = () => {
    const { camera, gl } = useThree();
    const [isPointerLocked, setIsPointerLocked] = useState(false);
    const isRequestingPointerLock = useRef(false); // Track if a request is in progress

    useEffect(() => {
        const handlePointerLockChange = () => {
            const isLocked = document.pointerLockElement === gl.domElement;
            setIsPointerLocked(isLocked);

            // Reset the request flag when the lock state changes
            isRequestingPointerLock.current = false;

            if (!isLocked) {
                console.warn("Pointer lock exited.");
            }
        };

        const handlePointerLockError = () => {
            console.error("Pointer lock error occurred.");
            isRequestingPointerLock.current = false; // Reset the request flag on error
        };

        document.addEventListener("pointerlockchange", handlePointerLockChange);
        document.addEventListener("pointerlockerror", handlePointerLockError);

        return () => {
            document.removeEventListener("pointerlockchange", handlePointerLockChange);
            document.removeEventListener("pointerlockerror", handlePointerLockError);
        };
    }, [gl.domElement]);

    const requestPointerLock = () => {
        if (!isRequestingPointerLock.current) {
            isRequestingPointerLock.current = true; // Set the flag to prevent overlapping requests
            gl.domElement.requestPointerLock();
        }
    };

    return <PointerLockControls args={[camera, gl.domElement]} />;
};
*/