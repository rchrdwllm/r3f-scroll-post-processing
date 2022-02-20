import type { FunctionComponent } from "react";
import styles from "./Canvas.module.scss";
import useMobileDetect from "use-mobile-detect-hook";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import Scene from "components/Scene";
import Effects from "components/Effects";

const Canvas: FunctionComponent = ({ children }) => {
    const { isMobile }: { isMobile: () => true } = useMobileDetect();

    return (
        <div className={styles.canvasContainer}>
            <FiberCanvas
                camera={{ position: [0, 0, 5] }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x141414, 1);
                }}
            >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <ScrollControls pages={3} damping={isMobile() ? 20 : 6}>
                    <Scroll>
                        <Scene />
                    </Scroll>
                    <Scroll html>{children}</Scroll>
                    <Effects />
                </ScrollControls>
            </FiberCanvas>
        </div>
    );
};

export default Canvas;
