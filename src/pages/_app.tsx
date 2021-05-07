import { AppProps } from "next/app";

import "../styles/main.scss";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="page">
            <Component {...pageProps} />
        </div>
    );
}
