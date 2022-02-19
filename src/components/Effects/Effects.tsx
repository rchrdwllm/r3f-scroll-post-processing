import * as THREE from "three";
import { useThree, extend, Object3DNode, useFrame } from "@react-three/fiber";
import { Effects as EffectComposer, useScroll } from "@react-three/drei";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { useRef } from "react";

const CustomShader = {
    uniforms: {
        tDiffuse: { value: null },
        offset: { value: 0 },
    },
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform float offset;

        
        vec2 rgbShifter(vec2 uv, float customOffset) {
            uv.y = uv.y + (offset * customOffset);

            return uv;
        }

        void main() {
            vec2 uv = vUv;

            float r = texture2D(tDiffuse, rgbShifter(uv, -2.5)).r;
            float g = texture2D(tDiffuse, rgbShifter(uv, 0.0)).g;
            float b = texture2D(tDiffuse, rgbShifter(uv, 2.5)).b;

            gl_FragColor = vec4(r, g, b, 1.0);
        }
    `,
};

class MyRenderPass extends RenderPass {}
class MyShaderPass extends ShaderPass {}

extend({ MyRenderPass, MyShaderPass, CustomShader });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            myRenderPass: Object3DNode<RenderPass, typeof RenderPass>;
            myShaderPass: Object3DNode<ShaderPass, typeof ShaderPass>;
        }
    }
}

const Effects = () => {
    const { scene, camera } = useThree();
    const scroll = useScroll();
    const shaderRef = useRef<THREE.ShaderMaterial>();

    useFrame(() => {
        if (shaderRef.current) {
            const target = scroll.offset;
            const current = (scroll as any).scroll.current;

            shaderRef.current.uniforms.offset.value = (target - current) * 0.08;
        }
    });

    return (
        <EffectComposer>
            <myRenderPass attachArray="passes" scene={scene} camera={camera} />
            <myShaderPass
                ref={shaderRef}
                attachArray="passes"
                args={[CustomShader]}
            />
        </EffectComposer>
    );
};

export default Effects;
