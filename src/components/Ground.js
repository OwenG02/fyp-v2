import { usePlane } from "@react-three/cannon";
import { TextureLoader, RepeatWrapping } from "three";
import { useLoader } from "@react-three/fiber";

export const Ground = () => {
    const [ref] = usePlane(() => ({ rotation:[-Math.PI / 2,0,0],position:[0,0,0] }));
    
    const gridTexture = useLoader(TextureLoader, "/assets/textures/vape_grid.jpg");
    gridTexture.wrapS = gridTexture.wrapT = RepeatWrapping;
    gridTexture.repeat.set(10, 10); //tiling adj.

    return (
        <mesh ref={ref}>
            <planeGeometry attach="geometry" args={[400, 400]} />
            <meshBasicMaterial attach="material" map={gridTexture} />
        </mesh>
    );
};