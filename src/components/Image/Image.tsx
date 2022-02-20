import * as THREE from "three";
import { useFrame, extend, Object3DNode, useLoader } from "@react-three/fiber";
import { shaderMaterial, useScroll } from "@react-three/drei";
import { useMemo, useRef } from "react";
import useMobileDetect from "use-mobile-detect-hook";

const MyShaderMaterial = shaderMaterial(
    {},
    `
        varying vec2 vUv;
        uniform float shiftOffset;

        vec3 deformation(vec3 pos) {
            pos.y = pos.y - (sin(uv.x * 3.14) * shiftOffset * 10.0);

            return pos;
        }

        void main() {
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(deformation(position), 1.0);
        }
    `,
    `
        // background cover style from https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44
        varying vec2 vUv;
        uniform vec2 scale;
        uniform vec2 imageBounds;
        uniform sampler2D tDiffuse;
        uniform float shiftOffset;
        uniform float zoom;
        
        vec2 aspect(vec2 size) {
            return size / min(size.x, size.y);
        }

        vec2 shifter(vec2 uv, float customOffset) {
            uv.y = uv.y + (shiftOffset * customOffset);

            return uv;
        }

        void main() {
            vec2 s = aspect(scale);
            vec2 i = aspect(imageBounds);

            float rs = s.x / s.y;
            float ri = i.x / i.y;

            vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
            vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
            vec2 uv = vUv * s / new + offset;
            vec2 zUv = (uv - vec2(0.5, 0.5)) / zoom + vec2(0.5, 0.5);

            float r = texture2D(tDiffuse, shifter(zUv, -1.25)).r;
            float g = texture2D(tDiffuse, shifter(zUv, 0.0)).g;
            float b = texture2D(tDiffuse, shifter(zUv, 1.25)).b;

            gl_FragColor = vec4(r, g, b, 1.0);
        }
    `
);

class ShaderMaterial extends MyShaderMaterial {}

extend({ ShaderMaterial, MyShaderMaterial });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            myShaderMaterial: Object3DNode<
                ShaderMaterial,
                typeof ShaderMaterial
            >;
        }
    }
}

interface ImageProps {
    url: string;
    position?: [number, number, number];
    scale?: any;
    zoom?: number | [range: number, distance: number, multiplier?: number];
    zoomReverse?: boolean;
}

const Image = ({
    url,
    position = [0, 0, 0],
    scale = [1, 1, 20, 20],
    zoom = 1,
    zoomReverse = false,
}: ImageProps) => {
    const texture = useLoader(THREE.TextureLoader, url);
    const planeBounds = Array.isArray(scale)
        ? [scale[0], scale[1]]
        : [scale, scale];
    const imageBounds = [texture.image.width, texture.image.height];
    const shaderRef = useRef<THREE.ShaderMaterial>();
    const scroll = useScroll();
    const { isMobile }: { isMobile: () => true } = useMobileDetect();

    useFrame(() => {
        if (shaderRef.current) {
            const zoomValue = Array.isArray(zoom)
                ? zoom[2]
                    ? scroll.range(zoom[0], zoom[1]) * zoom[2]
                    : scroll.range(...zoom)
                : zoom;

            const shiftOffset =
                (scroll.offset - (scroll as any).scroll.current) *
                (isMobile() ? 0.35 : 0.1);

            shaderRef.current.uniforms.shiftOffset.value = shiftOffset;
            shaderRef.current.uniforms.scale.value = planeBounds;
            shaderRef.current.uniforms.zoom.value = zoomReverse
                ? 1 - zoomValue
                : 1 + zoomValue;
        }
    });

    const uniforms = useMemo(
        () => ({
            tDiffuse: { value: texture },
            shiftOffset: { value: 0 },
            imageBounds: { value: imageBounds },
            scale: { value: planeBounds },
            zoom: { value: 1 },
        }),
        []
    );

    return (
        <mesh position={position}>
            <planeGeometry attach="geometry" args={scale} />
            <myShaderMaterial ref={shaderRef} uniforms={uniforms} />
        </mesh>
    );
};

export default Image;
