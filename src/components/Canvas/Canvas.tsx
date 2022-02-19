import type { FunctionComponent } from "react";
import styles from "./Canvas.module.scss";
import { Canvas as FiberCanvas } from "@react-three/fiber";
import { ScrollControls, Scroll } from "@react-three/drei";
import Scene from "components/Scene";
import Effects from "components/Effects";

const Canvas: FunctionComponent = ({ children }) => {
    return (
        <div className={styles.canvasContainer}>
            <FiberCanvas
                camera={{ position: [0, 0, 5] }}
                onCreated={({ gl }) => {
                    gl.setClearColor(0x1a1a1a, 1);
                }}
            >
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <ScrollControls pages={3} damping={6}>
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
