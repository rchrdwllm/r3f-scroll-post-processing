import data from "data";
import { useThree } from "@react-three/fiber";
import { Image } from "@react-three/drei";

const Scene = () => {
    const {
        viewport: { height, width },
    } = useThree();

    return (
        <group>
            <Image
                url={data[0]}
                position={[width / 4, 0, 1]}
                scale={[width / 2, height, 0] as any}
            />
            <Image
                url={data[1]}
                position={[-3, -height, 0]}
                scale={[4, 5, 0] as any}
            />
            <Image
                url={data[2]}
                position={[2, -height - 1, 2]}
                scale={[3, 4, 0] as any}
            />
            <Image
                url={data[3]}
                position={[0, -height * 2 - height / 4, 1]}
                scale={[width, height / 1.25, 0] as any}
            />
        </group>
    );
};

export default Scene;
