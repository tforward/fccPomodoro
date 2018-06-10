"use strict";

import css_ from "../css/styles.css";
import { EventDelegator, getTargetId } from "./olooEvent";
import { SubscribersDelegator } from "./olooObserver";
import { ElementDelegator, initElemObjects } from "./olooElem";

const Tock = require("tocktimer");

const myBase = Object.create(null);

const myApp = SubscribersDelegator();

myBase.initApplication = function init() {
  myApp.init();
  addElements();
  const eventSandbox = EventDelegator();
  eventSandbox.initEvent("eventSandbox", "click", { tags: ["BUTTON", "I"] });
  eventSandbox.addEvent(eventController);
  myApp.state = -1;

  function eventController(args, e) {
    // Only Passes events of with tagNames defined in the array
    const id = getTargetId(e, args.tags);
    if (id !== undefined) {
      myBase.main(id);
    }
  }
};

myBase.main = function main(id) {
  const self = myApp.obj[id];
  let num = getSessionLength();
  let numBreak = getBreakLength();

  if (id === "start_stop") {
    startStop(self);
  } else if (id === "session-increment") {
    num = upperLimit(num);
    setSessionLength(num);
    formattedDisplayTime(num);
    reset();
  } else if (id === "session-decrement") {
    num = lowerLimit(num);
    setSessionLength(num);
    formattedDisplayTime(num);
    reset(num);
  } else if (id === "break-increment") {
    numBreak = upperLimit(numBreak);
    setBreakLength(numBreak);
  } else if (id === "break-decrement") {
    numBreak = lowerLimit(numBreak);
    setBreakLength(numBreak);
  } else if (id === "reset") {
    reset();
    setSessionLength(25);
    formattedDisplayTime(25);
    setBreakLength(5);
  }
};

function formattedDisplayTime(num) {
  const mmss = getformatSessionLength(num);
  displayTime(mmss);
}

function upperLimit(num) {
  let limit = num;
  if (limit >= 60) {
    return limit;
  }
  limit += 1;
  return limit;
}

function lowerLimit(num) {
  let limit = num;
  if (limit <= 1) {
    return limit;
  }
  limit -= 1;
  return limit;
}

function reset() {
  if (myApp.timer !== undefined) {
    resetBeep();
    myApp.timer.stop();
    myApp.obj["time-left"].elem.textContent = getformatSessionLength();
    const startBtn = myApp.obj["start_stop"];
    startBtn.toggle = -1;
    startBtn.elem.className = "fas fa-play-circle";
    clockDial(0, 0);
  }
}

function startStop(obj) {
  const self = obj;
  if (self.toggle === -1) {
    // Init Start
    myApp.timer = getTimer();
    self.toggle = 1;
    self.elem.className = "fas fa-pause-circle";
    const startTime = timer();
    myApp.timer.start(startTime);
    myApp.state = 1;
  } else if (self.toggle === 1) {
    // Pause
    self.toggle = 0;
    myApp.timer.pause();
    self.elem.className = "fas fa-play-circle";
    if (myApp.state === 1) {
      posClock(getSessionLength());
    } else if (myApp.state === 0) {
      posClock(getBreakLength());
    }
  } else {
    // Start
    self.toggle = 1;
    // Unpause
    myApp.timer.pause();
    self.elem.className = "fas fa-pause-circle";
    clockDial(60, myApp.timer.final_time * 0.001);
  }
}

function posClock(timeLength) {
  const pausedTime = myApp.timer.final_time * 0.001;
  const x = pausedTime / 60;
  const b = timeLength - x;
  const c = timeLength / b;
  const d = 60 / c;
  clockDial(d, 0);
}

function setBreakLength(breakNum) {
  myApp.obj["break-length"].elem.textContent = breakNum;
}

function setSessionLength(num) {
  myApp.obj["session-length"].elem.textContent = num;
}

function getBreakLength() {
  const sessionAsStr = parseInt(myApp.obj["break-length"].elem.textContent, 10);
  return sessionAsStr;
}

function getSessionLength() {
  const sessionAsStr = parseInt(myApp.obj["session-length"].elem.textContent, 10);
  return sessionAsStr;
}

function timer() {
  const session = getformatSessionLength();
  const startTime = myApp.timer.timeToMS(session);

  // Get the time in mins and convert to seconds
  const sessionLengthSecs = myApp.obj["session-length"].elem.textContent * 60;
  clockDial(60, sessionLengthSecs);
  return startTime;
}

function clockDial(clock, session) {
  setClockDisplay(clock);
  setTimeDuration(session);
}

function addElements() {
  const labelIds = ["timer-label", "break-length", "session-length", "time-left", "circleTime"];

  const btnIds = [
    "break-decrement",
    "break-increment",
    "session-decrement",
    "session-increment",
    "start_stop",
    "reset"
  ];

  const labels = initElemObjects(labelIds, ElementDelegator);
  const buttons = initElemObjects(btnIds, ButtonDelegator, ElementDelegator);

  // Run the setup function on each button
  buttons.forEach(btn => btn.setup());

  myApp.addItems(labels);
  myApp.addItems(buttons);
}

function ButtonDelegator(proto = null) {
  const Button = Object.create(proto);

  Button.setup = function setup() {
    this.toggle = -1;
  };
  return Button;
}

function getformatSessionLength() {
  const sessionAsStr = getSessionLength();
  return `${sessionAsStr}:00`;
}

function displayTime(timeMMSS) {
  const str = `${timeMMSS}`;
  const pad = "00000";
  const formatted = pad.substring(0, pad.length - str.length) + str;
  myApp.obj["time-left"].elem.textContent = formatted;
}

function updateTime() {
  const currentTime = myApp.timer.msToTimecode(myApp.timer.lap());
  const timeMMSS = currentTime.substring(3, 8);
  displayTime(timeMMSS);
}

function switchSession() {
  const timerLbl = myApp.obj["timer-label"];
  if (myApp.state === 1) {
    timerLbl.elem.textContent = "Break";
    myApp.state = 0;
    initNewTimer(getBreakLength());
    myApp.obj["circleTime"].elem.className = "break";
  } else if (myApp.state === 0) {
    timerLbl.elem.textContent = "Session";
    myApp.obj["circleTime"].elem.className = "working";
    myApp.state = 1;
    initNewTimer(getSessionLength());
  }
}

function playBeep() {
  const beep = document.getElementById("beep");
  beep.play();
}

function resetBeep() {
  const beep = document.getElementById("beep");
  beep.currentTime = 0;
}

function initNewTimer(timelength) {
  const time = timelength * 60000;
  myApp.timer = getTimer();
  myApp.timer.start(time);

  playBeep();
  if (myApp.state === 1) {
    clockDial(60, getSessionLength() * 60);
  } else if (myApp.state === 0) {
    clockDial(0, getBreakLength() * 60);
  }
  myApp.obj["start_stop"].toggle = 1;
}

function getTimer() {
  const newTimer = new Tock({
    countdown: true,
    interval: 250,
    callback: updateTime,
    complete: switchSession
  });
  return newTimer;
}

function setClockDisplay(pos) {
  // Range 0 - 60, 15 is a quarter
  document.documentElement.style.setProperty("--pos", `${pos}vmin`);
}

function setTimeDuration(time) {
  // in seconds
  document.documentElement.style.setProperty("--time", `${time}s`);
}

// ======================================================================
// Handler when the DOM is fully loaded
document.onreadystatechange = function onreadystatechange() {
  if (document.readyState === "complete") {
    if (process.env.NODE_ENV !== "production") {
      console.log("*** RUNNING IN DEV MODE! ***");
    }
    myBase.initApplication();
  } else {
    // Do something during loading (optional)
  }
};
// ======================================================================
