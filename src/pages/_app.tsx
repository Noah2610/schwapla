import { AppProps } from "next/app";

import "../styles/index.scss";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="page">
            <Component {...pageProps} />
        </div>
    );
}
