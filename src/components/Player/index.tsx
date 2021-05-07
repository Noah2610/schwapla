import { useCallback } from "react";
import shallow from "zustand/shallow";
import classNames from "classnames";
import useStore from "../../store";
import styles from "./Player.module.scss";
import Slider from "../Slider";

export default function Player({ id }: { id: string }) {
    const { player, setPlayer, audio } = useStore(
        useCallback(
            (state) => ({
                player: state.players[id],
                setPlayer: state.setPlayer.bind(null, id),
                audio: state.audio[id],
            }),
            [id],
        ),
        ({ player: a, audio: audioA }, { player: b, audio: audioB }) =>
            shallow(a, b) && audioA?.isLoading === audioB?.isLoading,
    );

    if (!player || !audio) {
        console.error(`Player or audio with ID "${id}" does not exist`);
        return null;
    }

    const togglePlay = () =>
        setPlayer((player) => {
            const isPlaying = !player.isPlaying;
            if (isPlaying) {
                audio.audio.play();
            } else {
                audio.audio.pause();
                audio.audio.currentTime = 0;
            }
            return {
                ...player,
                isPlaying,
            };
        });

    const setSpeed = (speed: number) => {
        setPlayer((player) => ({
            ...player,
            speed,
        }));
        audio.audio.playbackRate = speed;
    };

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
                        [styles.loading!]: audio.isLoading,
                    },
                )}
                onClick={togglePlay}
            >
                {player.isPlaying ? "Stop" : "Play"}
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
