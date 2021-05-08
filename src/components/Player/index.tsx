import shallow from "zustand/shallow";
import classNames from "classnames";
import useStore from "../../store";
import styles from "./Player.module.scss";
import PlayerValue from "./PlayerValue";

export default function Player({ id }: { id: string }) {
    const { player } = useStore(
        (state) => ({
            player: state.getPlayer(id),
        }),
        ({ player: a }, { player: b }) => shallow(a, b),
    );

    if (!player) {
        console.error(`Player or audio with ID "${id}" does not exist`);
        return null;
    }

    return (
        <div className={styles.player}>
            <button
                className={classNames(
                    "btn",
                    styles.playBtn,
                    {
                        [styles.playing!]: player.isPlaying,
                    },
                    {
                        [styles.loading!]: player.audio.isLoading,
                    },
                )}
                onClick={player.togglePlay}
            >
                {player.isPlaying ? "Stop" : "Play"}
            </button>

            <div className={styles.sliders}>
                <PlayerValue
                    id={id}
                    label="Speed"
                    value={player.speed}
                    min={0.1}
                    max={4.0}
                    step={0.1}
                    onChange={player.setSpeed}
                />
            </div>
        </div>
    );
}
