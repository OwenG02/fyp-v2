import { PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const FirstPersonCamera = ({}) => {
    const { camera, gl } = useThree();

    /*useEffect(() => {
        const handleClick = (event) => {
          // Check if the clicked element is inside Leva
          if (event.target.closest(".leva")) {
            return; // Don't request pointer lock when clicking Leva UI
          }
          gl.domElement.requestPointerLock();
        };
    
        document.addEventListener("click", handleClick);
    
        return () => {
          document.removeEventListener("click", handleClick);
        };
      }, [gl]);*/

    return <PointerLockControls args={[camera, gl.domElement]} />;
};
