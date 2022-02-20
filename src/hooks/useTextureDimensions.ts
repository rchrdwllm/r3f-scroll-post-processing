import { useEffect, useState } from "react";
import * as THREE from "three";

export const useTextureDimensions = (texture: THREE.Texture) => {
    const [dimensions, setDimensions] = useState({
        width: texture.image.width,
        height: texture.image.height,
    });

    const onResize = () => {
        setDimensions({
            width: texture.image.width,
            height: texture.image.height,
        });
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("resize", onResize);

            return () => window.removeEventListener("resize", onResize);
        }
    });

    return dimensions;
};
