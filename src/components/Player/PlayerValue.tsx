import classNames from "classnames";
import clamp from "../../util/clamp";
import Slider, { SliderProps } from "../Slider";
import styles from "./PlayerValue.module.scss";

export interface PlayerValueProps extends SliderProps {
    id: string;
    label: string;
}

export default function PlayerValue({
    id,
    label,
    value,
    onChange,
    min,
    max,
    step,
}: PlayerValueProps) {
    const inputId = `player-value-${id}-${label}`;

    return (
        <div className={styles.playerValue}>
            <label htmlFor={inputId} className={styles.label}>
                {label}
            </label>

            <div className={styles.items}>
                <div className={classNames(styles.item, styles.slider)}>
                    <Slider
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        onChange={onChange}
                    />
                </div>
                <div className={classNames(styles.item, styles.input)}>
                    <input
                        id={inputId}
                        className="input"
                        type="number"
                        value={value}
                        min={min}
                        max={max}
                        step={step}
                        onChange={
                            onChange &&
                            ((e) => {
                                const value = e.currentTarget.value;
                                const newValue = clamp(
                                    value === "" ? 0 : parseFloat(value),
                                    min,
                                    max,
                                );
                                if (newValue || newValue === 0) {
                                    onChange(newValue);
                                }
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
}
