import * as React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Tooltip from "@material-ui/core/Tooltip";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import InfoIcon from "@material-ui/icons/Info";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SpeedIcon from "@material-ui/icons/Speed";
import HeightIcon from "@material-ui/icons/Height";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";

import Slider, { SliderTarget } from "./Slider";
import VoiceSelect from "./VoiceSelect";
import MultilineTextField from "./MultilineTextField";
import { KDSpeechSynth } from "../scripts/KDSpeechSynth";

const drawerWidth = 300;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  hide: {
    display: "none !important"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    // padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between",
    "& .MuiIconButton-root": {
      left: "auto",
      top: "auto",
      right: "auto",
      bottom: "auto"
    }
  },
  drawerFooter: {
    fontFamily: "'Courier New', Courier, monospace",
    fontSize: "0.65rem",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    "& .MuiList-root": {
      width: "100%",
      "& .MuiListItem-root": {
        display: "flex",
        width: "100%",
        justifyContent: "space-between"
      }
    }
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  }
}));

export function SettingsDrawer({
  synth
}: {
  synth: KDSpeechSynth;
}): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [voices, setVoices] = React.useState([] as string[]);
  const [history, setHistory] = React.useState([] as string[]);

  const handleTexts = (display: string) => {
    const instructions = document.getElementById("instructions");
    const credit = document.getElementById("credit");
    if (instructions) instructions.style.display = display;
    if (credit) credit.style.display = display;
  };

  const handleDrawerOpen = () => {
    setOpen(true);
    setVoices(synth.voices());
    setHistory(synth.history());
    handleTexts("none");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    handleTexts("block");
  };

  const handleShowInfo = () => {
    console.log("show info");
  };

  return (
    <div style={{ width: "100" }} className={classes.root}>
      <CssBaseline />
      <Tooltip title="Open Drawer">
        <IconButton
          style={{ position: "absolute", right: 10, top: 0, height: "100%" }}
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerOpen}
          className={clsx(open && classes.hide)}
        >
          <MenuIcon style={{ color: "#fff" }} />
        </IconButton>
      </Tooltip>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <Tooltip title="Info">
            <IconButton onClick={handleShowInfo}>
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close Drawer">
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </Tooltip>
        </div>
        <List>
          <Tooltip title="Some voices aren't affected by the speech parameters.">
            <ListItem key={"SettingsDrawer-Select"}>
              <VoiceSelect voices={voices} synth={synth} />
            </ListItem>
          </Tooltip>
          {[
            [SliderTarget.Rate, <SpeedIcon />],
            [SliderTarget.Pitch, <HeightIcon />],
            [SliderTarget.Volume, <VolumeUpIcon />]
          ].map(slider => {
            return (
              <ListItem
                key={`SettingsDrawer-Slider-${slider[0] as SliderTarget}`}
              >
                <Tooltip title={slider[0]}>
                  <ListItemIcon>{slider[1] as JSX.Element}</ListItemIcon>
                </Tooltip>
                <Slider synth={synth} target={slider[0] as SliderTarget} />
              </ListItem>
            );
          })}
        </List>
        <List>
          <ListItem key={"SettingsDrawer-TextField"}>
            <MultilineTextField initialHistory={history} synth={synth} />
          </ListItem>
        </List>
        <div className={classes.drawerFooter}>
          <List>
            <ListItem key={"SettingsDrawer-Footer-Credits"}>
              <div>dumpbott v0.0.7</div>
              <div>·</div>
              <div>justKD 2020</div>
            </ListItem>
            <ListItem key={"SettingsDrawer-Footer-Instructions"}>
              <div>acquire[_sound]</div>
              <div>·</div>
              <div>request[dumpbott.speak]</div>
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
}
