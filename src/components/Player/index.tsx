import shallow from "zustand/shallow";
import classNames from "classnames";
import useStore from "../../store";
import styles from "./Player.module.scss";
import PlayerValue from "./PlayerValue";
import playerValueSettings from "./playerValueSettings";

export default function Player({ id }: { id: string }) {
    const { player, removePlayer } = useStore(
        (state) => ({
            player: state.getPlayer(id),
            removePlayer: state.removePlayer.bind(null, id),
        }),
        ({ player: a }, { player: b }) => shallow(a, b),
    );

    if (!player) {
        console.error(`Player or audio with ID "${id}" does not exist`);
        return null;
    }

    return (
        <div className={styles.player}>
            <div className="btnGroup btnGroup--vert">
                {player.audio.name && (
                    <span
                        className={styles.audioName}
                        title={player.audio.name}
                    >
                        {player.audio.name}
                    </span>
                )}

                <button
                    className={classNames(
                        "btn",
                        styles.playerBtn,
                        styles.playBtn,
                        {
                            [styles.playing!]: player.isPlaying,
                            [styles.loading!]: player.audio.isLoading,
                        },
                    )}
                    onClick={player.togglePlay}
                >
                    {player.isPlaying ? "Stop" : "Play"}
                </button>
                <button
                    className={classNames(
                        "btn",
                        "btn--alternate",
                        styles.playerBtn,
                        styles.removeBtn,
                    )}
                    onClick={removePlayer}
                >
                    Remove
                </button>
            </div>

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
