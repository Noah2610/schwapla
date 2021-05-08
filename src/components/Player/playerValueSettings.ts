import { PlayerState } from "../../store";

// https://stackoverflow.com/a/51419293/10927893
type KeyOfType<T, U> = {
    [P in keyof T]: U extends T[P] ? P : never;
}[keyof T];

type PlayerValueName = KeyOfType<PlayerState, number>;
type PlayerValueSetterName = KeyOfType<PlayerState, (x: number) => void>;

export interface PlayerValueSettings {
    name: PlayerValueName;
    setterName: PlayerValueSetterName;
    label: string;
    min: number;
    max: number;
    step: number;
}

const PLAYER_VALUES_SETTINGS: readonly PlayerValueSettings[] = Object.freeze([
    {
        name: "volume",
        setterName: "setVolume",
        label: "Volume",
        min: 0.0,
        max: 1.0,
        step: 0.05,
    },
    {
        name: "speed",
        setterName: "setSpeed",
        label: "Speed",
        min: 0.2,
        max: 4.0,
        step: 0.1,
    },
]);

export default PLAYER_VALUES_SETTINGS;
