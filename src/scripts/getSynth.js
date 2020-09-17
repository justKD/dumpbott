import "../css/rainbow.css";
import { KDSpeechSynth } from "./KDSpeechSynth";
import anime from "animejs/lib/anime.es.js";

let interval = true;
export const getSynth = (glitch, video, onStart, onEnd) => {
  let animate;
  const del = 30;
  const letters = 17;
  const button = document.getElementById("button");

  const stopAnimate = () => {
    if (animate) animate.pause();
  };

  const synth = new KDSpeechSynth({
    voice: 0,
    rate: 0.9,
    pitch: 0.1,
    onSpeakStart: (e) => {
      button.className = "button rounded"; //rainbow
      glitch.goWild = true;
      if (video) video.play();
      if (!animate) {
        animate = anime
          .timeline({ loop: true, direction: "alternate", autoplay: false })
          .add({
            targets: "#button .letter",
            scale: [0.2, 1],
            duration: del * letters,
            elasticity: 200,
            delay: (el, i) => del * (i + 1),
          });
      }
      animate.play();
      if (typeof onStart === "function") onStart(synth.text());
    },
    onSpeakEnd: (e) => {
      const end = () => {
        if (video) video.pause();
        button.className = "button";
        glitch.goWild = false;
        stopAnimate();
      };
      end();
      if (typeof onEnd === "function") onEnd();
      if (synth.isSpeaking()) {
        interval = setInterval(() => {
          if (!synth.isSpeaking()) {
            end();
            clearInterval(interval);
          }
        }, 20);
      }
    },
    onBoundary: (e) => {
      glitch.goWild = !glitch.goWild;
      setTimeout(() => {
        glitch.goWild = !glitch.goWild;
      }, 20);
    },
  });

  return synth;
};
