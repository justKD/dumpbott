//const anime = require("animejs");
import anime from "animejs/lib/anime.es.js";

export const animateTextOnScreen = (id: string, delay: any) => {
  const node = document.getElementById(id);
  const width = node ? node.getBoundingClientRect().width * 2 : "800px";

  const setInitPos = (el: HTMLElement) => {
    el.style.transform = `translate(${-width}px)`;
  };

  const animate = (el: HTMLElement) => {
    anime({
      targets: el,
      translateX: width,
      duration: 2000,
      delay: delay,
    });
  };

  if (node) {
    setInitPos(node);
    animate(node);
  }
};
