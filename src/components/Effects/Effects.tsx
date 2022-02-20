import * as THREE from "three";
import { Effects as EffectComposer, useScroll } from "@react-three/drei";
import { RenderPass as ThreeRenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { FilmPass as ThreeFilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { extend, Object3DNode, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";

class FilmPass extends ThreeFilmPass {}

extend({ FilmPass });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            filmPass: Object3DNode<FilmPass, typeof FilmPass>;
        }
    }
}

const Effects = () => {
    const { scene, camera, viewport, gl } = useThree();
    const filmRef = useRef<any>();
    const composerRef = useRef<any>();
    const scroll = useScroll();

    useFrame(() => {
        if (composerRef.current) {
            composerRef.current.render();
        }
    });

    return (
        <EffectComposer ref={composerRef} args={[gl]}>
            <renderPass attachArray="passes" scene={scene} camera={camera} />
            <filmPass attachArray="passes" args={[0.15, 0.25, 1024, 0]} />
        </EffectComposer>
    );
};

export default Effects;
