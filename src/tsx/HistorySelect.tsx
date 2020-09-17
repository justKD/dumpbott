import * as React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";

const BootstrapInput = withStyles(theme => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(3)
    }
  },
  input: {
    borderRadius: 4,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  }
}))(InputBase);

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%"
  }
}));

export default function HistorySelect({
  history,
  value,
  handleChange
}: {
  history: string[];
  value: number;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  const classes = useStyles();

  return (
    <div style={{ width: "100%" }}>
      <FormControl className={classes.container}>
        <InputLabel htmlFor="demo-customized-select-native">History</InputLabel>
        <NativeSelect
          key="History-Select"
          id="demo-customized-select-native"
          value={value}
          onChange={handleChange}
          input={<BootstrapInput />}
        >
          {history.map((text, index) => {
            return (
              <option key={`${index}-${text}`} value={index}>
                {text}
              </option>
            );
          })}
        </NativeSelect>
      </FormControl>
    </div>
  );
}
