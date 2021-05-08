import classNames from "classnames";
import styles from "./Heading.module.scss";

export interface HeadingProps {
    children: string;
    variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export default function Heading({ children, variant: H }: HeadingProps) {
    return <H className={classNames(styles.heading, styles[H])}>{children}</H>;
}
