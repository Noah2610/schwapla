import styles from "./Slider.module.scss";

export default function Slider({
    value,
    min,
    max,
    step,
    onChange,
}: {
    value: number;
    min: number;
    max: number;
    step: number;
    onChange?: (value: number) => void;
}) {
    return (
        <div>
            <input
                className={styles.slider}
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
        </div>
    );
}
