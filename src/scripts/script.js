"use strict";

import css_ from "../css/styles.css";

// import { EventDelegator, getTargetId } from "./olooEvent";

// import { SubscribersDelegator } from "./olooObserver";

import { ElementDelegator, FragmentDelegator } from "./olooElem";

const Tock = require("tocktimer");

const myBase = Object.create(null);

myBase.initApplication = function init() {
  // setClockDisplay(60);
  // setTimeDuration(25);
  addElements();

  const timer = getTimer();
  timer.start("25:00");
};

function addElements() {
  const jsEntry = ElementDelegator();
  const nodeFrag = FragmentDelegator();

  jsEntry.init("jsEntry");
  nodeFrag.initFragment();

  const [lblBreak, lblSession, lblTimer, lblBreakLen, lblSessionLen, lblTimeLeft] = createLabels();

  // Append items to fragment before appending to DOM to reduce redraws
  nodeFrag.addItems([lblBreak, lblSession, lblTimer, lblBreakLen, lblSessionLen, lblTimeLeft]);
  jsEntry.elem.appendChild(nodeFrag.fragment);
  console.log(jsEntry);
}

function createLabels() {
  const lblBreak = ElementDelegator();
  const lblSession = ElementDelegator();
  const lblTimer = ElementDelegator();
  const lblBreakLen = ElementDelegator();
  const lblSessionLen = ElementDelegator();
  const lblTimeLeft = ElementDelegator();

  lblBreak.create("break-label", "label");
  lblBreak.elem.textContent = "Break";
  lblBreak.elem.className = "lbl center";

  lblSession.create("session-label", "label");
  lblSession.elem.textContent = "Session";
  lblSession.elem.className = "lbl center";

  lblTimer.create("timer-label", "label");
  lblTimer.elem.textContent = "Session";
  lblTimer.elem.className = "lbl center";

  lblBreakLen.create("break-length", "label");
  lblBreakLen.elem.textContent = 5;
  lblBreakLen.elem.className = "lbl center";

  lblSessionLen.create("session-length", "label");
  lblSessionLen.elem.textContent = 25;
  lblSessionLen.elem.className = "lbl center";

  lblTimeLeft.create("time-left", "label");
  lblTimeLeft.elem.textContent = "25:00";
  lblTimeLeft.elem.className = "lbl center";

  return [lblBreak, lblSession, lblTimer, lblBreakLen, lblSessionLen, lblTimeLeft];
}

function displayTime(timer) {
  const currentTime = timer.msToTimecode(timer.lap());
  // console.log(timer.msToTimecode(timer.lap()));
  const timeMMSS = currentTime.substring(3, 8);
  console.log(currentTime);
}

function getTimer() {
  const timer = new Tock({
    countdown: true,
    interval: 1000,
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
