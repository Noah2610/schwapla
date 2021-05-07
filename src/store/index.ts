import createStore from "zustand";
import produce from "immer";
import { v4 as newUuid } from "uuid";

export type State = StateStore & StateApi;

interface StateStore {
    players: Record<PlayerId, PlayerState>;
    audio: Record<PlayerId, AudioState>;
}

interface StateApi {
    addPlayer(): void;
    setPlayer(id: PlayerId, setter: (player: PlayerState) => PlayerState): void;

    loadAudio(id: PlayerId, src: string): Promise<void>;
}

type PlayerId = string;

export interface PlayerState {
    isPlaying: boolean;
    speed: number;
}

export interface AudioState {
    audio: HTMLAudioElement;
    isLoading: boolean;
}

function newPlayer(): PlayerState {
    return {
        isPlaying: false,
        speed: 1.0,
    };
}

const AUDIO_SRC = "./schwa.ogg";

export default createStore<State>((set, get, _api) => ({
    players: {},
    audio: {},

    addPlayer() {
        const id = newUuid();
        set(
            (base) =>
                produce(base, (state) => {
                    const player = newPlayer();
                    state.players[id] = player;
                }),
            true,
        );
        get().loadAudio(id, AUDIO_SRC).catch(console.error);
    },

    async loadAudio(id, src) {
        const audio = new Audio(src);
        audio.loop = true;

        set(
            (state) => ({
                ...state,
                audio: {
                    ...state.audio,
                    [id]: {
                        audio,
                        isLoading: true,
                    },
                },
            }),
            true,
        );

        try {
            await new Promise<void>((resolve, reject) => {
                audio.load();
                audio.onloadeddata = () => resolve();
                audio.onerror = (err) => reject(err);
            });
        } catch (err) {
            throw new Error(`Failed to load audio: ${src}`);
        }

        set(
            (state) => ({
                ...state,
                audio: {
                    ...state.audio,
                    [id]: {
                        audio,
                        isLoading: false,
                    },
                },
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
