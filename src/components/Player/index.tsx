import { useCallback } from "react";
import shallow from "zustand/shallow";
import classNames from "classnames";
import useStore from "../../store";
import styles from "./Player.module.scss";
import Slider from "../Slider";

export default function Player({ id }: { id: string }) {
    const { player, setPlayer } = useStore(
        useCallback(
            (state) => ({
                player: state.players[id],
                setPlayer: state.setPlayer.bind(null, id),
            }),
            [id],
        ),
        ({ player: a }, { player: b }) => shallow(a, b),
    );

    if (!player) {
        console.error(`Player with ID "${id}" does not exist`);
        return null;
    }

    const togglePlay = () =>
        setPlayer((player) => ({
            ...player,
            isPlaying: !player.isPlaying,
        }));
    const setSpeed = (speed: number) =>
        setPlayer((player) => ({
            ...player,
            speed: speed,
        }));

    return (
        <div className={styles.player}>
            <button
                className={classNames("btn", styles.playBtn, {
                    [styles.playing!]: player.isPlaying,
                })}
                onClick={togglePlay}
            >
                {player.isPlaying ? "Pause" : "Play"}
            </button>

            <div className={styles.sliders}>
                <Slider
                    value={player.speed}
                    min={0.1}
                    max={4.0}
                    step={0.1}
                    onChange={setSpeed}
                />
            </div>
        </div>
    );
}
