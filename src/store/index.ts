import createStore from "zustand";
import produce from "immer";
import { v4 as newUuid } from "uuid";

export type State = StateStore & StateApi;

interface StateStore {
    players: Record<PlayerId, PlayerState>;
}

interface StateApi {
    addPlayer(audioSrc?: string): void;
    setPlayer(id: PlayerId, setter: PlayerSetter): void;
    getPlayer(id: PlayerId): PlayerState | undefined;
    removePlayer(id: PlayerId): void;
    playAllPlayers(): void;
    stopAllPlayers(): void;
}

type PlayerId = string;

export interface PlayerState {
    isPlaying: boolean;
    volume: number;
    speed: number;
    audio: PlayerAudioState;

    play(): void;
    stop(): void;
    togglePlay(): void;
    setVolume(volume: number): void;
    setSpeed(speed: number): void;
    setAudioSrc(src: string, name?: string): void;
}

export interface PlayerAudioState {
    audio: HTMLAudioElement;
    name?: string;
    isLoading: boolean;
    loadError?: string;
}

const AUDIO_SRC = "./schwa.ogg";

type PlayerSetter = (player: PlayerState) => PlayerState;

function newPlayer(
    audio: HTMLAudioElement,
    set: (setter: PlayerSetter) => void,
    get: () => PlayerState | undefined,
): PlayerState {
    const DEFAULT_VOLUME = 0.5;
    const DEFAULT_SPEED = 1.0;

    const name = audio.src.split("/").pop();

    audio.volume = DEFAULT_VOLUME;
    audio.playbackRate = DEFAULT_SPEED;
    audio.loop = true;

    audio.onloadeddata = () =>
        set((player) => ({
            ...player,
            audio: {
                ...player.audio,
                audio,
                isLoading: false,
                loadError: undefined,
            },
        }));
    audio.onerror = (err) =>
        set((player) => ({
            ...player,
            audio: {
                audio,
                isLoading: false,
                loadError:
                    typeof err === "string"
                        ? err
                        : `Error loading audio ${audio.src}`,
            },
        }));

    audio.load();

    const player: PlayerState = {
        isPlaying: false,
        volume: DEFAULT_VOLUME,
        speed: DEFAULT_SPEED,
        audio: {
            audio,
            name,
            isLoading: true,
            loadError: undefined,
        },

        play() {
            set((base) =>
                produce(base, (player) => {
                    if (!player.isPlaying) {
                        player.isPlaying = true;
                        player.audio.audio.play();
                    }
                }),
            );
        },
        stop() {
            set((base) =>
                produce(base, (player) => {
                    if (player.isPlaying) {
                        player.isPlaying = false;
                        player.audio.audio.pause();
                        player.audio.audio.currentTime = 0;
                    }
                }),
            );
        },
        togglePlay() {
            const player = get();
            if (player) {
                if (player.isPlaying) {
                    player.stop();
                } else {
                    player.play();
                }
            }
        },
        setVolume(volume) {
            set((base) =>
                produce(base, (player) => {
                    player.volume = volume;
                    player.audio.audio.volume = volume;
                }),
            );
        },
        setSpeed(speed) {
            set((base) =>
                produce(base, (player) => {
                    player.speed = speed;
                    player.audio.audio.playbackRate = speed;
                }),
            );
        },
        setAudioSrc(src, name) {
            set((base) =>
                produce(base, (player) => {
                    player.audio.audio.src = src;
                    player.audio.name = name || src.split("/").pop();
                    player.audio.isLoading = true;
                    player.audio.loadError = undefined;
                }),
            );
        },
    };

    return player;
}

export default createStore<State>((set, get, _api) => ({
    players: {},

    addPlayer(audioSrc = AUDIO_SRC) {
        const id = newUuid();
        const audio = new Audio(audioSrc);

        const setPlayer = (setter: PlayerSetter) => get().setPlayer(id, setter);
        const getPlayer = () => get().getPlayer(id);
        const player = newPlayer(audio, setPlayer, getPlayer);

        set((state) => ({
            players: {
                ...state.players,
                [id]: player,
            },
        }));
    },

    setPlayer(id, setter) {
        set(
            (base) =>
                produce(base, (state) => {
                    const player = state.players[id];
                    if (player) {
                        (state.players[id] as PlayerState) = setter(
                            player as PlayerState,
                        );
                    } else {
                        console.error(
                            `Tried to call \`setPlayer\` with ID "${id}" which doesn't exist`,
                        );
                    }
                }),
            true,
        );
    },

    getPlayer(id) {
        return get().players[id];
    },

    removePlayer(id) {
        set(
            (base) =>
                produce(base, (state) => {
                    delete state.players[id];
                }),
            true,
        );
    },

    playAllPlayers() {
        for (const player of Object.values(get().players)) {
            player.play();
        }
    },

    stopAllPlayers() {
        for (const player of Object.values(get().players)) {
            player.stop();
        }
    },
}));
