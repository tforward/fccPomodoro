"use strict";

import css_ from "../css/styles.css";

// import { EventDelegator, getTargetId } from "./olooEvent";

import { SubscribersDelegator } from "./olooObserver";

import { ElementDelegator, FragmentDelegator } from "./olooElem";

const Tock = require("tocktimer");

const myBase = Object.create(null);

const myApp = SubscribersDelegator();
myApp.init();

myBase.initApplication = function init() {
  addElements();

  myBase.main();
};

myBase.main = function main() {
  const timer = getTimer();
  const sessionAsStr = parseInt(myApp.elems["session-length"].textContent, 10);
  const startTime = timer.timeToMS(`${sessionAsStr}:00`);

  timer.start(startTime);
  setClockDisplay(60);

  // Get the time in mins and convert to seconds
  const sessionLengthSecs = myApp.elems["session-length"].textContent * 60;
  setTimeDuration(sessionLengthSecs);
};

function addElements() {
  const jsEntry = ElementDelegator();
  const nodeFrag = FragmentDelegator();
  const nodeFragBtns = FragmentDelegator();

  jsEntry.init("jsEntry");
  nodeFrag.initFragment();
  nodeFragBtns.initFragment();

  const labels = createLabels();
  const buttonHolder = createBtnHolder();
  const buttons = createBtns();

  myApp.addItems(labels);
  myApp.addItems(buttonHolder);
  myApp.addItems(buttons);

  // Append items to fragment before appending to DOM to reduce redraws
  nodeFrag.addNodes(labels);
  nodeFrag.addNodes(buttonHolder);
  nodeFragBtns.addNodes(buttons);

  myApp.elems["btn-holder"].appendChild(nodeFragBtns.fragment);
  jsEntry.elem.appendChild(nodeFrag.fragment);
}

function ButtonDelegator(proto = null) {
  const Button = Object.create(proto);

  Button.setup = function setup() {
    this.toggle = 0;
  };

  return Button;
}

function createBtnHolder() {
  const btnHolder = ElementDelegator();
  btnHolder.create("btn-holder", "div");
  btnHolder.elem.className = "center";
  return [btnHolder];
}

function createBtns() {
  const btnBreakDesc = ButtonDelegator(ElementDelegator());

  btnBreakDesc.create("break-decrement", "button");
  btnBreakDesc.elem.textContent = "BTN";
  btnBreakDesc.elem.className = "center";

  return [btnBreakDesc];
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
