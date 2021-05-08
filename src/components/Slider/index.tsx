import { useCallback, useEffect, useRef } from "react";
import classNames from "classnames";
import styles from "./Slider.module.scss";

export interface SliderProps {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}

export default function Slider({
    value,
    min,
    max,
    step,
    onChange,
}: SliderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const dataRef = useRef({ value, min, max, step });
    dataRef.current = { value, min, max, step };

    const incr = useCallback(() => {
        const { value, step, max } = dataRef.current;
        const newValue = Math.min(value + step, max);
        if (newValue !== value) {
            onChange(newValue);
        }
    }, []);

    const decr = useCallback(() => {
        const { value, step, min } = dataRef.current;
        const newValue = Math.max(value - step, min);
        if (newValue !== value) {
            onChange(newValue);
        }
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            const onWheel = (event: WheelEvent) => {
                event.preventDefault();
                switch (Math.sign(event.deltaY)) {
                    case 1:
                        decr();
                        break;
                    case -1:
                        incr();
                        break;
                }
            };

            inputRef.current.addEventListener("wheel", onWheel);

            return () =>
                inputRef.current?.removeEventListener("wheel", onWheel);
        }
    }, [inputRef, incr, decr]);

    return (
        <input
            className={classNames("input", styles.slider)}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
                const newValue = parseFloat(e.currentTarget.value);
                if (newValue || newValue === 0) {
                    onChange(newValue);
                }
            }}
            ref={inputRef}
        />
    );
}
