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
  } else if (id === "reset") {
    reset();
  } else if (id === "session-increment") {
    num += 1;
  } else if (id === "session-decrement") {
    num -= 1;
  } else if (id === "break-increment") {
    numBreak += 1;
  } else if (id === "break-decrement") {
    numBreak -= 1;
  }
  setSessionLength(num);
  setBreakLength(numBreak);
};

function reset() {
  if (myApp.timer !== undefined) {
    myApp.timer.stop();
    myApp.obj["time-left"].elem.textContent = getformatSessionLength();
    const startBtn = myApp.obj["start_stop"];
    startBtn.toggle = -1;
    startBtn.elem.className = "fas fa-play-circle";
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
  } else if (self.toggle === 1) {
    // Pause
    self.toggle = 0;
    myApp.timer.pause();
    self.elem.className = "fas fa-play-circle";
  } else {
    // Start
    self.toggle = 1;
    // Unpause
    myApp.timer.pause();
    self.elem.className = "fas fa-pause-circle";
  }
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

function getformatSessionLength() {
  const sessionAsStr = getSessionLength();
  return `${sessionAsStr}:00`;
}

function timer() {
  const session = getformatSessionLength();
  const startTime = myApp.timer.timeToMS(session);

  setClockDisplay(60);

  // Get the time in mins and convert to seconds
  const sessionLengthSecs = myApp.obj["session-length"].elem.textContent * 60;
  setTimeDuration(sessionLengthSecs);
  return startTime;
}

function addElements() {
  const labelIds = ["timer-label", "break-length", "session-length", "time-left"];

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

function displayTime() {
  const currentTime = myApp.timer.msToTimecode(myApp.timer.lap());
  const timeMMSS = currentTime.substring(3, 8);
  myApp.obj["time-left"].elem.textContent = timeMMSS;
}

function getTimer() {
  const newTimer = new Tock({
    countdown: true,
    interval: 250,
    callback: displayTime
    // complete: someCompleteFunction
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
