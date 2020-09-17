import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import { KDSpeechSynth } from "../scripts/KDSpeechSynth";
import { Numbers } from "../scripts/Numbers";

const useStyles = makeStyles({
  root: {
    width: "100%"
  }
});

export enum SliderTarget {
  Pitch = "Pitch",
  Rate = "Rate",
  Volume = "Volume"
}

export default function ContinuousSlider({
  synth,
  target
}: {
  synth: KDSpeechSynth;
  target: SliderTarget;
}) {
  const classes = useStyles();
  const sliderScale: [number, number] = [0, 100];

  const [value, setValue] = React.useState(0);
  const [scale, setScale] = React.useState([0, 100] as [number, number]);

  /**
   * Run when component renders. Watch for an empty array of variable changes
   * in order to ensure this only runs once.
   */
  React.useEffect(() => {
    switch (target) {
      case SliderTarget.Rate:
        setScale([0.1, 10]);
        setValue(Numbers.scale(synth.rate(), [0.1, 10], sliderScale));
        break;
      case SliderTarget.Pitch:
        setScale([0, 2]);
        setValue(Numbers.scale(synth.pitch(), [0, 2], sliderScale));
        break;
      case SliderTarget.Volume:
        setScale([0, 1]);
        setValue(Numbers.scale(synth.volume(), [0, 1], sliderScale));
        break;
      default:
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    if (typeof newValue === "number" && newValue !== value) {
      if (synth.isSpeaking()) synth.cancel();

      setValue(newValue);

      switch (target) {
        case SliderTarget.Rate:
          synth.rate(Numbers.scale(newValue, [0, 100], scale));
          break;
        case SliderTarget.Pitch:
          synth.pitch(Numbers.scale(newValue, [0, 100], scale));
          break;
        case SliderTarget.Volume:
          synth.volume(Numbers.scale(newValue, [0, 100], scale));
          break;
        default:
      }
    }
  };

  return (
    <div className={classes.root}>
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby="continuous-slider"
      />
    </div>
  );
}
