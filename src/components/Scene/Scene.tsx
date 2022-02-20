import data from "data";
import { useThree } from "@react-three/fiber";
import Image from "components/Image";

const Scene = () => {
    const {
        viewport: { height, width },
    } = useThree();

    return (
        <group>
            <Image
                url={data[0]}
                position={[width / 4, 0, 1]}
                scale={[width / 2, height, 20, 20] as any}
                zoom={[0, 1, 0.5]}
            />
            <Image
                url={data[1]}
                position={[-3, -height, 0]}
                scale={[4, 4, 20, 20] as any}
                zoom={[0.2, 1, 0.5]}
            />
            <Image
                url={data[2]}
                position={[2, -height - 1, 2]}
                scale={[3, 4, 20, 20] as any}
                zoom={[1.5 / 3, 1, 0.5]}
            />
            <Image
                url={data[3]}
                position={[0, -height * 2 - height / 4, 1]}
                scale={[width, height / 1.5, 20, 20] as any}
                zoom={[2 / 3, 2]}
                zoomReverse
            />
        </group>
    );
};

export default Scene;
