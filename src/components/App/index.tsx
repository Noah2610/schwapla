import shallow from "zustand/shallow";
import styles from "./App.module.scss";
import useStore from "../../store";
import Player from "../Player";

export default function App() {
    const { playerIds, addPlayer } = useStore(
        (state) => ({
            playerIds: Object.keys(state.players),
            addPlayer: state.addPlayer,
        }),
        ({ playerIds: a }, { playerIds: b }) => shallow(a, b),
    );

    return (
        <div className={styles.appRoot}>
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
