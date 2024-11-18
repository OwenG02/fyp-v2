import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { useKeyboard } from "../hooks/useKeyboard";


const JUMP_FORCE = 5;
const SPEED = 5;

export const Player = ({ mode }) => {
    const { moveBackward, moveForward, moveLeft, moveRight, jump } = useKeyboard(mode);

    const { camera } = useThree();
    const [ref, api] = useSphere(() => ({
        mass: 1,
        type: 'Dynamic',
        position: [0, 1.6, 10],
    }));

    // follows sphere position
    const pos = useRef([0, 0, 0]);
    useEffect(() => {
        api.position.subscribe((p) => pos.current = p);
    }, [api.position]);

    // same for velocity
    const vel = useRef([0, 0, 0]);
    useEffect(() => {
        api.velocity.subscribe((v) => vel.current = v);
    }, [api.velocity]);


    useFrame(() => {
        if (mode === 'walk') {
            //console.log(mode);
            camera.position.copy(new Vector3(pos.current[0], pos.current[1], pos.current[2]));

            // vectors for movement
            const dir = new Vector3();

            const frontVector = new Vector3(
                0,
                0,
                (moveBackward ? 1 : 0) - (moveForward ? 1 : 0) // cancel front and back if both true
            );

            const sideVector = new Vector3(
                (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
                0,
                0
            );

            dir.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(camera.rotation);
            api.velocity.set(dir.x, vel.current[1], dir.z);

            // jumping if on the ground
            if (jump && pos.current[1] < 1.6) {
                api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
            }
        }
    });

    return (
        <mesh ref={ref}></mesh>
    );
};
