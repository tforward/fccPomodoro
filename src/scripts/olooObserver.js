// ======================================================================
// Observer Delegator Pattern
// ======================================================================

export function SubscribersDelegator() {
  const Subscribe = Object.create(null);

  Subscribe.init = function init() {
    this.elems = Object.create(null);
  };
  Subscribe.subscribe = function subscribe(id, elem) {
    this.elems[id] = elem;
  };
  Subscribe.unsubscribe = function unsubscribe(elem) {
    // Can unsubscribe one observer, or an array of observers
    if (typeof elem === "string") {
      delete this.elems[elem];
    } else {
      elem.forEach(key => delete this.elems[key]);
    }
  };
  Subscribe.broadcast = function broadcast(func, ...args) {
    // On each object called func
    // Any additional args will get passed into the func
    // define them just using comma seperator
    const keys = Object.keys(this.elems);
    for (let i = 0; i < keys.length; i += 1) {
      this.elems[keys[i]][func](...args);
    }
  };
  return Subscribe;
}

// ======================================================================
// Observer Delegator Utilities
// ======================================================================

export function createObserversById(subscriber, ids, delegator) {
  ids.forEach(elemId => {
    const elem = document.getElementById(elemId);
    const observer = delegator();
    observer.init(elemId, elem);
    subscriber.subscribe(observer);
  });
}
