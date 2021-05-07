import { useCallback } from "react";
import shallow from "zustand/shallow";
import classNames from "classnames";
import styles from "./Player.module.scss";
import useStore from "../../store";

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
        </div>
    );
}
