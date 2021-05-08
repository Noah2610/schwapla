import shallow from "zustand/shallow";
import classNames from "classnames";
import useStore from "../../store";
import styles from "./Player.module.scss";
import PlayerValue from "./PlayerValue";
import playerValueSettings from "./playerValueSettings";

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

            <div className={styles.playerValues}>
                {playerValueSettings.map((settings) => (
                    <PlayerValue
                        key={settings.name}
                        id={id}
                        label={settings.label}
                        value={player[settings.name]}
                        min={settings.min}
                        max={settings.max}
                        step={settings.step}
                        onChange={player[settings.setterName]}
                    />
                ))}
            </div>
        </div>
    );
}
