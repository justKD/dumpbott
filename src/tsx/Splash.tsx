import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import HeadsetIcon from "@material-ui/icons/Headset";
import SpeakerIcon from "@material-ui/icons/Speaker";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    color: "#fff",
    width: "100%",
    height: "100%",
    display: "flex",
    alignContent: "center",
    alignItems: "center",
    justifyItems: "center",
    justifyContent: "center",
    textAlign: "center",
    "& .MuiSvgIcon-root": {
      fontSize: "5rem"
    }
  }
}));

export default function Splash() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <HeadsetIcon />
      <MoreHorizIcon />
      <VolumeUpIcon />
      <MoreHorizIcon />
      <SpeakerIcon />
    </div>
  );
}
