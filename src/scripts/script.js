"use strict";

import css_ from "../css/styles.css";

import { EventDelegator, getTargetId } from "./olooEvent";

import { SubscribersDelegator } from "./olooObserver";

import { ElementDelegator } from "./olooElem";

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
      // const obj = myApp[id];
      console.log(myApp);
    }
  }
  myBase.main();
};

myBase.main = function main(id) {
  if (id === "start-stop") {
    const timer = getTimer();
    const sessionAsStr = parseInt(myApp.elems["session-length"].textContent, 10);
    const startTime = timer.timeToMS(`${sessionAsStr}:00`);
    timer.start(startTime);
    setClockDisplay(60);

    // Get the time in mins and convert to seconds
    const sessionLengthSecs = myApp.elems["session-length"].textContent * 60;
    setTimeDuration(sessionLengthSecs);
  }
};

function addElements() {
  const labels = initLabels();
  const buttons = initBtns();

  myApp.addItems(labels);
  myApp.addItems(buttons);
}

function ButtonDelegator(proto = null) {
  const Button = Object.create(proto);

  Button.setup = function setup() {
    this.toggle = 0;
  };

  return Button;
}

function initBtns() {
  // TODO REFACTOR
  const btnBreakDesc = ButtonDelegator(ElementDelegator());
  const btnBreakAsc = ButtonDelegator(ElementDelegator());
  const btnSessionDesc = ButtonDelegator(ElementDelegator());
  const btnSessionAsc = ButtonDelegator(ElementDelegator());
  const btnStart = ButtonDelegator(ElementDelegator());
  const btnReset = ButtonDelegator(ElementDelegator());

  btnBreakDesc.init("break-decrement");
  btnBreakAsc.init("break-increment");
  btnSessionDesc.init("session-decrement");
  btnSessionAsc.init("session-increment");
  btnStart.init("start_stop");
  btnReset.init("reset");

  return [btnBreakDesc, btnBreakAsc, btnSessionDesc, btnSessionAsc, btnStart, btnReset];
}

function initLabels() {
  // TODO REFACTOR
  const lblTimer = ElementDelegator();
  const lblBreakLen = ElementDelegator();
  const lblSessionLen = ElementDelegator();
  const lblTimeLeft = ElementDelegator();

  lblTimer.init("timer-label");
  lblBreakLen.init("break-length");
  lblSessionLen.init("session-length");
  lblTimeLeft.init("time-left");

  return [lblTimer, lblBreakLen, lblSessionLen, lblTimeLeft];
}

function displayTime(timer) {
  const currentTime = timer.msToTimecode(timer.lap());
  const timeMMSS = currentTime.substring(3, 8);
  myApp.elems["time-left"].textContent = timeMMSS;
}

function getTimer() {
  const timer = new Tock({
    countdown: true,
    interval: 250,
    callback: displayTime
    // complete: someCompleteFunction
  });
  return timer;
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
