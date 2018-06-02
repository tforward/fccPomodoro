"use strict";

import css_ from "../css/styles.css";

// import { EventDelegator, getTargetId } from "./olooEvent";

// import { SubscribersDelegator } from "./olooObserver";

const myBase = Object.create(null);

myBase.initApplication = function init() {
  console.log("hi");
};

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
