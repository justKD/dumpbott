// import "./dev/cdn.tests";
// import { rollup } from "./dev/rollup.manager";

import * as React from "react";
import { render } from "react-dom";
import App from "./App";
import Splash from "./tsx/Splash";

// import { fromEvent } from "rxjs";
// import { List } from "immutable";
// import { Synth } from "tone";

const rootElement = document.getElementById("root");
render(<App />, rootElement);

const splashElement = document.getElementById("splash");
render(<Splash />, splashElement);

const hideHamburgerIcon = () => {
  const buttons: HTMLElement[] = Array.from(
    document.querySelectorAll(".MuiButtonBase-root")
  );
  buttons.forEach(el => (el.style.display = "none"));
};
hideHamburgerIcon();

// rollup.log(false);

//
