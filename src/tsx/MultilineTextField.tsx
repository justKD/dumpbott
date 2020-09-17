import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import FormatClearIcon from "@material-ui/icons/FormatClear";
import Tooltip from "@material-ui/core/Tooltip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import HistorySelect from "./HistorySelect";
import { KDSpeechSynth } from "../scripts/KDSpeechSynth";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    "& .MuiTextField-root": {
      width: "100%"
    },
    "& .MuiButtonGroup-root": {
      width: "100%"
    },
    "& .MuiButton-root": {
      width: "100%",
      right: "auto",
      bottom: "auto",
      "& .MuiButton-label": {
        display: "flex",
        direction: "column",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center"
      }
    }
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1)
    }
  }
}));

export default function MultilineTextField({
  synth,
  initialHistory
}: {
  synth: KDSpeechSynth;
  initialHistory: string[];
}) {
  const classes = useStyles();
  const [textValue, setTextValue] = React.useState("dumpbott");
  const [history, setHistory] = React.useState(initialHistory);
  const [historyValue, setHistoryValue] = React.useState();

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
  };

  const handleClearClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setTextValue("");
  };

  const handleSpeakClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (synth.isSpeaking()) synth.cancel();
    if (typeof textValue === "string" && textValue.length > 0) {
      synth.speak(textValue);
    } else {
      const text = history[historyValue];
      setTextValue(text);
      synth.speak(text, true);
    }
    const newHistory = synth.history();
    setHistory(newHistory);
    if (textValue !== history[historyValue]) {
      setHistoryValue(newHistory.length - 1);
    }
  };

  const handleClearHistoryClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    synth.clearHistory();
    setHistory([]);
    setHistoryValue(0);
  };

  const handleHistoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHistoryValue(event.target.value);
    setTextValue(history[Number(event.target.value)]);
  };

  React.useEffect(() => {
    setHistory(initialHistory);
  }, [initialHistory]);

  return (
    <div className={classes.root}>
      <form noValidate autoComplete="off">
        <Tooltip title="Input text and click speak.">
          <TextField
            id="outlined-multiline-static"
            label="// Input Text"
            multiline
            rows="4"
            variant="outlined"
            value={textValue}
            onChange={handleTextChange}
          />
        </Tooltip>
      </form>
      <div className={classes.buttonGroup}>
        <ButtonGroup color="primary" aria-label="outlined primary button group">
          <Tooltip title="Clear the history.">
            <Button onClick={handleClearHistoryClick}>
              <ClearAllIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Clear input text.">
            <Button onClick={handleClearClick}>
              <FormatClearIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Ask dumpbott to speak.">
            <Button onClick={handleSpeakClick}>
              <RecordVoiceOverIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>
      <div>
        {/* <Tooltip title="h"> */}
        <HistorySelect
          history={history}
          value={historyValue}
          handleChange={handleHistoryChange}
        />
        {/* </Tooltip> */}
      </div>
    </div>
  );
}
