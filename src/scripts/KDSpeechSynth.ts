import { Numbers } from "./Numbers";
import { TryAgainLoop } from "./TryAgainLoop";
import { check } from "./check";
import { KDHistoryArray } from "./KDHistoryArray";
import { regexp } from "./regexp";

export type KDSpeechSynthParams = {
  voice?: number;
  text?: string;
  rate?: number; // 0.1 - 10
  pitch?: number; // 0 - 2
  volume?: number; // 0 - 1
  maxHistory?: number;
  onReady?: () => {};
  onSpeakStart?: (e: any) => void;
  onSpeakEnd?: (e: any) => void;
  onError?: (e: any) => void;
  onPause?: (e: any) => void;
  onResume?: (e: any) => void;
  onMark?: (e: any) => void;
  onBoundary?: (e: any) => void;
  onVoicesChanged?: (e: any) => void;
};

export class KDSpeechSynth {
  synth: () => SpeechSynthesis;

  voices: () => string[];
  voice: (voice?: number) => number;

  speak: (text?: string, noStore?: boolean) => void;

  onSpeakStart: (callback: (e: any) => void) => void;
  onSpeakEnd: (callback: (e: any) => void) => void;
  onError: (callback: (e: any) => void) => void;
  onPause: (callback: (e: any) => void) => void;
  onResume: (callback: (e: any) => void) => void;
  onMark: (callback: (e: any) => void) => void;
  onBoundary: (callback: (e: any) => void) => void;
  onVoicesChanged: (callback: (e: any) => void) => void;

  text: (text?: string) => string;
  rate: (rate?: number) => number;
  pitch: (pitch?: number) => number;
  volume: (volume?: number) => number;

  isReady: () => boolean;
  isSpeaking: () => boolean;
  isPending: () => boolean;
  isPaused: () => boolean;

  cancel: () => void;
  pause: () => void;
  resume: () => void;

  history: () => string[];
  maxHistory: (max?: number) => number;
  clearHistory: () => void;

  /**
   * SpeechSynth
   * @param params
   * @note
   * ```
   *  export type KDSpeechSynthParams = {
   *    voice?: number;
   *    text?: string;
   *    rate?: number;    // 0.1 - 10
   *    pitch?: number;   // 0 - 2
   *    volume?: number;  // 0 - 1
   *    maxHistory?: number;
   *    onReady?: () => {};
   *    onSpeakStart?: (e: any) => void;
   *    onSpeakEnd?: (e: any) => void;
   *    onError?: (e: any) => void;
   *    onPause?: (e: any) => void;
   *    onResume?: (e: any) => void;
   *    onMark?: (e: any) => void;
   *    onBoundary?: (e: any) => void;
   *    onVoicesChanged?: (e: any) => void;
   *  };
   * ```
   */
  constructor(params?: KDSpeechSynthParams) {
    const state: {
      ready: boolean;
      text: string;
      voice: number;
      history: KDHistoryArray;
      volume: number;
      rate: number;
      pitch: number;
    } = {
      ready: false,
      text: "",
      voice: 0,
      history: new KDHistoryArray(),
      volume: 1.0, // 0 - 1
      rate: 1.0, // 0.1 - 10
      pitch: 1.0 // 0 - 2
    };

    const props: {
      synth: SpeechSynthesis;
      voices: SpeechSynthesisVoice[];
      onSpeakStart: (e: any) => void;
      onSpeakEnd: (e: any) => void;
      onError: (e: any) => void;
      onPause: (e: any) => void;
      onResume: (e: any) => void;
      onMark: (e: any) => void;
      onBoundary: (e: any) => void;
      onVoicesChanged: (e: any) => void;
    } = {
      synth: window.speechSynthesis,
      voices: [],
      onSpeakStart: () => {},
      onSpeakEnd: () => {},
      onError: () => {},
      onPause: () => {},
      onResume: () => {},
      onMark: () => {},
      onBoundary: () => {},
      onVoicesChanged: () => {}
    };

    const _: {
      updateVoices: () => void;
      getVoices: () => SpeechSynthesisVoice[];
      listVoices: () => string[];
      voice: (voice?: number) => number;
      rate: (rate?: number) => number;
      pitch: (pitch?: number) => number;
      volume: (volume?: number) => number;
      text: (text?: string) => string;
      speak: (text?: string, noStore?: boolean) => void;

      onSpeakStart: (callback: (e: any) => void) => void;
      onSpeakEnd: (callback: (e: any) => void) => void;
      onError: (callback: (e: any) => void) => void;
      onPause: (callback: (e: any) => void) => void;
      onResume: (callback: (e: any) => void) => void;
      onMark: (callback: (e: any) => void) => void;
      onBoundary: (callback: (e: any) => void) => void;
      onVoicesChanged: (callback: (e: any) => void) => void;

      isReady: () => boolean;
      isSpeaking: () => boolean;
      isPending: () => boolean;
      isPaused: () => boolean;

      cancel: () => void;
      pause: () => void;
      resume: () => void;

      maxHistory: (max?: number) => number;
      history: () => string[];
      clearHistory: () => void;
    } = {
      updateVoices: () => {
        props.voices = _.getVoices();
        state.ready = props.voices.length > 0;
      },

      getVoices: () => {
        if (check.exists(props.synth)) {
          return props.synth.getVoices().sort(function(a, b) {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            else if (aname === bname) return 0;
            else return +1;
          });
        } else {
          return [];
        }
      },

      listVoices: () => {
        const voices: string[] = props.voices.map(voice => {
          let text = `${voice.name} (${voice.lang})`;
          if (voice.default) text += " -- DEFAULT";
          return text;
        });
        return voices;
      },

      voice: voice => {
        if (check.is.safeInteger(voice)) state.voice = voice as number;
        return state.voice;
      },

      rate: rate => {
        if (check.is.safeNumber(rate)) {
          state.rate = Numbers.clip(rate as number, [0.1, 10]);
        }
        return state.rate;
      },

      pitch: pitch => {
        if (check.is.safeNumber(pitch)) {
          state.pitch = Numbers.clip(pitch as number, [0, 2]);
        }
        return state.pitch;
      },

      volume: volume => {
        if (check.is.safeNumber(volume)) {
          state.volume = Numbers.clip(volume as number, [0, 1]);
        }
        return state.volume;
      },

      text: text => {
        if (check.is.string(text)) state.text = text as string;
        return state.text;
      },

      speak: (text, noStore = false) => {
        /* Ensure SpeechSynth is initialized. */
        if (!state.ready) {
          console.error("SpeechSynth is not ready.");
          return;
        }

        /* If currently speaking. */
        if (props.synth.speaking) {
          //console.error("SpeechSynth.isSpeaking");
          //return;
          this.cancel();
        }

        /* Set new text if available. */
        if (check.is.string(text)) state.text = text as string;

        /* Guard against invalid text. */
        if (!check.is.string(state.text) || state.text === "") {
          console.error("No text for SpeechSynth to speak.");
          return;
        }

        if (!noStore) {
          if (typeof text === "string") {
            const t = regexp.undo(text);
            if (!state.history.includes(t)) state.history.push(t as string);
          }
        }

        const getVoice = () => {
          if (props.voices.length > 0) {
            if (props.voices.length >= state.voice) {
              return props.voices[state.voice];
            } else {
              return props.voices[0];
            }
          } else {
            console.error("Unable to find any voices.");
            return;
          }
        };

        const getUtterance = (): SpeechSynthesisUtterance => {
          const utterance = new SpeechSynthesisUtterance(state.text);

          const voice = getVoice();
          if (check.exists(voice)) {
            utterance.voice = voice as SpeechSynthesisVoice;
          }

          utterance.pitch = state.pitch;
          utterance.rate = state.rate;
          utterance.volume = state.volume;

          utterance.onstart = props.onSpeakStart;
          utterance.onend = props.onSpeakEnd;
          utterance.onerror = e => {
            console.error(`SpeechSynthesisUtterance.onerror - ${e.error}`);
            props.onError(e);
          };
          utterance.onpause = props.onPause;
          utterance.onresume = props.onResume;
          utterance.onmark = props.onMark;
          utterance.onboundary = props.onBoundary;

          return utterance;
        };

        const utterThis = getUtterance();
        props.synth.speak(utterThis);
      },

      onSpeakEnd: callback => {
        if (check.is.function(callback)) props.onSpeakEnd = callback;
      },

      onSpeakStart: callback => {
        if (check.is.function(callback)) props.onSpeakStart = callback;
      },

      onError: callback => {
        if (check.is.function(callback)) props.onError = callback;
      },
      onPause: callback => {
        if (check.is.function(callback)) props.onPause = callback;
      },
      onResume: callback => {
        if (check.is.function(callback)) props.onResume = callback;
      },
      onMark: callback => {
        if (check.is.function(callback)) props.onMark = callback;
      },
      onBoundary: callback => {
        if (check.is.function(callback)) props.onBoundary = callback;
      },

      onVoicesChanged: callback => {
        if (check.is.function(callback)) {
          if (check.exists(props.synth)) {
            props.onVoicesChanged = callback;
            props.synth.onvoiceschanged = e => {
              _.updateVoices();
              props.onVoicesChanged(e);
            };
          }
        }
      },

      isReady: () => state.ready,
      isSpeaking: () => props.synth.speaking,
      isPending: () => props.synth.pending,
      isPaused: () => props.synth.paused,

      cancel: () => props.synth.cancel(),
      pause: () => props.synth.pause(),
      resume: () => props.synth.resume(),

      history: () => Array.from(state.history),
      maxHistory: max => {
        if (typeof max === "number") {
          state.history.max(max);
        }
        return state.history.max();
      },
      clearHistory: () => {
        state.history = new KDHistoryArray();
      }
    };

    this.synth = () => props.synth;
    this.voices = () => _.listVoices();
    this.voice = voice => _.voice(voice);

    this.text = text => _.text(text);
    this.rate = rate => _.rate(rate);
    this.pitch = pitch => _.pitch(pitch);
    this.volume = volume => _.volume(volume);

    this.isReady = () => _.isReady();
    this.isSpeaking = () => _.isSpeaking();
    this.isPending = () => _.isPending();
    this.isPaused = () => _.isPaused();

    this.speak = (text, noStore = false) => _.speak(text, noStore);
    this.cancel = () => _.cancel();
    this.pause = () => _.pause();
    this.resume = () => _.resume();

    this.onSpeakStart = callback => _.onSpeakStart(callback);
    this.onSpeakEnd = callback => _.onSpeakEnd(callback);
    this.onError = callback => _.onError(callback);
    this.onPause = callback => _.onPause(callback);
    this.onResume = callback => _.onResume(callback);
    this.onMark = callback => _.onMark(callback);
    this.onBoundary = callback => _.onBoundary(callback);
    this.onVoicesChanged = callback => _.onVoicesChanged(callback);

    this.maxHistory = size => _.maxHistory();
    this.history = () => _.history();
    this.clearHistory = () => _.clearHistory();

    const init = {
      run: () => {
        init.synth();
        init.voices();
        init.handleParams();
        init.readOnly();
        init.onReadyCheck();
      },

      synth: () => {
        if (window.speechSynthesis !== undefined) {
          props.synth = window.speechSynthesis;
        } else {
          console.error("Unable to initialize SpeechSynth.");
        }
      },

      voices: () => {
        _.updateVoices();
        if (check.exists(props.synth)) {
          props.synth.onvoiceschanged = () => {
            _.updateVoices();
          };
        }
      },

      handleParams: () => {
        if (typeof params === "object") {
          Object.keys(params).forEach(paramkey => {
            Object.keys(state).forEach(statekey => {
              if (paramkey === statekey) {
                (state as any)[statekey] = (params as any)[paramkey];
              }
            });
            Object.keys(props).forEach(propskey => {
              if (paramkey === propskey) {
                (props as any)[propskey] = (params as any)[paramkey];
              }
            });
          });
        }
      },

      readOnly: () => {
        Object.keys(this).forEach(key => {
          Object.defineProperty(this, key, {
            value: (this as any)[key],
            writable: false,
            enumerable: true
          });
        });
      },

      onReadyCheck: () => {
        const onReadyKey = "onReady";
        if (
          typeof params === "object" &&
          (params as any).hasOwnProperty(onReadyKey) &&
          typeof params[onReadyKey] === "function"
        ) {
          const tryAgain = new TryAgainLoop({
            qualifier: state.ready,
            intervalInMS: 20,
            attempts: 10,
            callback: () => {
              tryAgain.qualifier = state.ready;
              (params as any)[onReadyKey]();
            }
          });
          tryAgain.run();
        }
      }
    };

    init.run();
  }
}
