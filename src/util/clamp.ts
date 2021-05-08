/**
 * Clamp a value between a given min and max values.
 * Both min and max values are inclusive.
 */
export default function clamp(value: number, min: number, max: number): number {
    return Math.max(Math.min(value, max), min);
}
