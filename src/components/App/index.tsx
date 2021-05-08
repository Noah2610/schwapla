import shallow from "zustand/shallow";
import styles from "./App.module.scss";
import useStore from "../../store";
import Player from "../Player";

export default function App() {
    const { playerIds, addPlayer, playAll, stopAll } = useStore(
        (state) => ({
            playerIds: Object.keys(state.players),
            addPlayer: state.addPlayer,
            playAll: state.playAllPlayers,
            stopAll: state.stopAllPlayers,
        }),
        ({ playerIds: a }, { playerIds: b }) => shallow(a, b),
    );

    return (
        <div className={styles.appRoot}>
            <div className="btnGroup">
                <button className="btn" onClick={playAll}>
                    Play All
                </button>
                <button className="btn" onClick={stopAll}>
                    Stop All
                </button>
            </div>

            <div className={styles.players}>
                {playerIds.map((playerId) => (
                    <Player key={playerId} id={playerId} />
                ))}
            </div>

            <div>
                <button className="btn" onClick={() => addPlayer()}>
                    Add Player
                </button>
            </div>
        </div>
    );
}
