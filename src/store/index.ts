import createStore from "zustand";
import produce from "immer";
import { v4 as newUuid } from "uuid";

export type State = StateStore & StateApi;

interface StateStore {
    players: Record<PlayerId, PlayerState>;
}

interface StateApi {
    addPlayer(): void;
    setPlayer(id: PlayerId, setter: (player: PlayerState) => PlayerState): void;
}

type PlayerId = string;

export interface PlayerState {
    isPlaying: boolean;
    speed: number;
}

function newPlayer(): PlayerState {
    return {
        isPlaying: false,
        speed: 1.0,
    };
}

export default createStore<State>((set, get, _api) => ({
    players: {},

    addPlayer() {
        set(
            (base) =>
                produce(base, (state) => {
                    state.players[newUuid()] = newPlayer();
                }),
            true,
        );
    },

    setPlayer(id, setter) {
        set(
            (base) =>
                produce(base, (state) => {
                    const player = state.players[id];
                    if (player) {
                        state.players[id] = setter(player);
                    } else {
                        console.error(
                            `Tried to call \`setPlayer\` with ID "${id}" which doesn't exist`,
                        );
                    }
                }),
            true,
        );
    },
}));
