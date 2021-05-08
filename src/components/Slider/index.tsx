import classNames from "classnames";
import styles from "./Slider.module.scss";

export interface SliderProps {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange?: (value: number) => void;
}

export default function Slider({
    value,
    min,
    max,
    step,
    onChange,
}: SliderProps) {
    return (
        <input
            className={classNames("input", styles.slider)}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={
                onChange &&
                ((e) => {
                    const newValue = parseFloat(e.currentTarget.value);
                    if (newValue || newValue === 0) {
                        onChange(newValue);
                    }
                })
            }
        />
    );
}
