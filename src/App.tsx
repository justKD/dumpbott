import * as React from "react";
import { synth } from "./scripts/approachDumpbott";
import { SettingsDrawer } from "./tsx/SettingsDrawer";

export default function App() {
  return (
    <div className="App">
      <SettingsDrawer synth={synth} />
    </div>
  );
}
