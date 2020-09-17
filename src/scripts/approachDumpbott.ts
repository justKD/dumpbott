import "../css/styles.css";
import { DumpbottVisuals } from "./DumpbottVisuals";
import { GlitchPass } from "./visuals/GlitchPass";
import { getSynth } from "./getSynth";
import { getTweets } from "./getTweets";
import { getTweetText } from "./getTweetText";
import { animateTextOnScreen } from "./animateTextOnScreen";
import { handleTextsOnStartup } from "./handleTextsOnStartup";
import { regexp } from "./regexp";
import { KDRoll } from "./KDRoll";

import anime from "animejs/lib/anime.es.js";

const _ = {
  approached: false,
  glitch: new GlitchPass(),
  button: document.getElementById("button"),
  video: document.getElementById("video-head"),
};
const divs: HTMLElement[] = [];
let text: any = "";

const createTweetElements = (displayText: string) => {
  const div = document.createElement("div");
  const inner = document.createElement("div");
  const innerText = document.createElement("div");

  div.className = "tweet-text";
  inner.className = "moving-text-wrapper";
  innerText.id = "tweet-letters";

  const undo = regexp.undo(displayText);
  innerText.innerHTML = undo;

  inner.appendChild(innerText);
  div.appendChild(inner);
  divs.push(div);
  document.body.append(div);

  const textWrapper = document.querySelector("#tweet-letters");
  if (textWrapper && textWrapper.textContent) {
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /\S/g,
      "<span class='letter black'>$&</span>",
    );
  }
};

const onSynthStart = (loadedText: string) => {
  if (divs && divs.length > 0) {
    divs.forEach((div, index) => {
      document.body.removeChild(div);
      divs.splice(index, 1);
    });
  }
  createTweetElements(loadedText);

  const rotateScale = 10;
  anime.timeline().add({
    targets: "#tweet-letters .letter",
    translateX: [40, 0],
    translateZ: 0,
    rotateZ: () => {
      const sides = rotateScale * 2 + 1;
      return KDRoll.scale(
        KDRoll.d(sides),
        [1, sides],
        [-rotateScale, rotateScale],
      );
    },
    opacity: [0, 1],
    easing: "easeOutExpo",
    duration: 500,
    delay: (el: any, i: number) => 30 * i,
  });
};

const onSynthEnd = () => {
  console.log("end");
};

const visuals = new DumpbottVisuals(_.glitch);
export const synth = getSynth(_.glitch, _.video, onSynthStart, onSynthEnd);

const approachDumpbott = () => {
  const showHamburgerIcon = () => {
    const buttons: HTMLElement[] = Array.from(
      document.querySelectorAll(".MuiButtonBase-root"),
    );
    buttons.forEach((el) => (el.style.display = "block"));
  };
  showHamburgerIcon();

  const splash = document.getElementById("splash");
  if (splash && splash.parentNode) splash.parentNode.removeChild(splash);

  setTimeout(() => synth.speak("dumpbott"), 500);

  handleTextsOnStartup();
  visuals.start();
  setTimeout(() => _.glitch.generateTrigger(), 4000);

  const baseDelay = 800;
  animateTextOnScreen("instructions", baseDelay);
  animateTextOnScreen("credit", baseDelay + 300);
};

const dumpbottDotSpeak = () => {
  if (!synth.isSpeaking()) {
    text = getTweetText(getTweets);
    if (typeof text === "string") {
      synth.speak(text);
    }
  } else {
    synth.cancel();
  }
};

if (_.button) {
  _.button.onclick = () => {
    if (!_.approached) {
      _.approached = true;
      approachDumpbott();
    } else {
      dumpbottDotSpeak();
    }
  };
}

if (_.button) _.button.style.display = "block";
