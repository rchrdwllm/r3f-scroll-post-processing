import type { AppProps } from "next/app";
import "style/globals.scss";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Canvas = dynamic(() => import("components/Canvas"), {
    suspense: true,
});

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <Suspense fallback={null}>
            <Canvas>
                <Component {...pageProps} />
            </Canvas>
        </Suspense>
    );
};

export default App;
