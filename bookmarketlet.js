// disable text selection
document.body.setAttribute(
  "style",
  "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none; -ms-user-select: none;user-select: none;",
);

const SHOW_BOUNDING_BOXES = false;

var draggedObject = null;
var dragOffset = { x: 0, y: 0 };
var prevMousePos = { x: 0, y: 0 };
var lastMouseTime = Date.now();
document.onmousemove = dragSelectedObject;

function dragSelectedObject(e) {
  //console.log(draggedObject);
  if (draggedObject == null) return;
  let dt = (Date.now() - lastMouseTime) / 1000;
  let mouseVel = {
    y: (e.clientY - prevMousePos.y) / dt,
    x: (e.clientX - prevMousePos.x) / dt,
  };

  draggedObject.pos.x = e.clientX - dragOffset.x;
  draggedObject.pos.y = e.clientY - dragOffset.y;
  updateObjectPos(draggedObject);

  draggedObject.prevPos.x = draggedObject.pos.x - mouseVel.x / 1000;
  draggedObject.prevPos.y = draggedObject.pos.y - mouseVel.y / 1000;

  prevMousePos = { x: e.clientX, y: e.clientY };
  lastMouseTime = Date.now();
}

function onMouseDown(e, el) {
  e.stopImmediatePropagation();

  dragOffset.x = e.clientX - el.pos.x;
  dragOffset.y = e.clientY - el.pos.y;

  draggedObject = el;
}

function onMouseUp(e, el) {
  e.stopImmediatePropagation();
  draggedObject = null;
}

function addClickListeners() {
  document
    .querySelectorAll(
      'button:not(.applied), div:not(.applied), a:not(.applied), input:not(.applied), select:not(.applied), textarea:not(.applied), img:not(.applied), svg:not(.applied), [tabindex]:not([tabindex="-1"]):not(.applied)',
    )
    .forEach((el) => {
      console.log("foind el");
      el.removeAttribute("href");
      el.classList.add("applied");
      if (isVisible(el)) {
        el.addEventListener("click", (e) => {
          handleClick(e, el);
        });
      }
    });
}

// not needed
function isVisible(el) {
  const style = getComputedStyle(el);
  if (el.firstChild != null && el.firstChild.nodeType == 3) {
    return true;
  }
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    el.offsetParent !== null
  );
}

function handleClick(e, el) {
  e.stopImmediatePropagation();

  // expand selection
  // limit selection

  // find visible shape
  // find background color

  popOut(el);
}

function updateObjectPos(obj) {
  obj.style.top = obj.pos.y + "px";
  obj.style.left = obj.pos.x + "px";
}

function popOut(el) {
  let copy = document.createElement("div");
  let bodyRect = document.body.getBoundingClientRect();
  let rect = el.getBoundingClientRect();

  copy.classList.add("applied");
  copy.pos = { x: rect.left - bodyRect.left, y: rect.top - bodyRect.top };
  copy.prevPos = { x: copy.pos.x, y: copy.pos.y + 3 }; // hack to add initial velocity
  copy.rect = { width: rect.width, height: rect.height };

  copy.style.position = "absolute";
  copy.style.width = copy.rect.width + "px";
  copy.style.height = copy.rect.height + "px";
  // copy.style.backgroundColor = getVisibleBackgroundColor(el)
  copy.style.overflow = "clip";
  copy.style.zIndex = 100000;

  if (SHOW_BOUNDING_BOXES) {
    copy.style.borderColor = "red";
    copy.style.borderWidth = "1px";
    copy.style.borderStyle = "solid";
  }

  updateObjectPos(copy);

  el.draggable = false;
  copy.innerHTML = el.outerHTML;

  document.body.appendChild(copy);
  el.remove();

  copy.addEventListener("mousedown", (e) => {
    onMouseDown(e, copy);
  });
  copy.addEventListener("mouseup", (e) => {
    onMouseUp(e, copy);
  });

  physicsObjects.push(copy);
}

// -- PHYSICS SIM -- //
// uses verlet integration because it's simple

const ENERGY_MULTIPLIER = 0.2;
var physicsObjects = [];
var gravity = { x: 0, y: 1000 };

function isColliding(obj, other) {
  return (obj.pos.x + obj.rect.width >= other.pos.x &&
      obj.pos.x <= other.pos.x + other.rect.width &&
      obj.pos.y + obj.rect.height >= other.pos.y &&
      obj.pos.y <= other.pos.y + other.rect.height);
}

function resolveCollision(obj, other) {
    dx = (obj.pos.x + obj.rect.width / 2) - (other.pos.x + other.rect.width / 2);
    dy = (obj.pos.y + obj.rect.height / 2) - (other.pos.y + other.rect.height / 2);
    xOverlap = (obj.rect.width + other.rect.width) / 2 - Math.abs(dx);
    yOverlap = (obj.rect.height + other.rect.height) / 2 - Math.abs(dy);

    if (xOverlap < yOverlap){
        if (dx < 0) {
          obj.pos.x -= xOverlap/2;
          other.pos.x += xOverlap/2;
          
        } else {
          obj.pos.x += xOverlap/2;
          other.pos.y -= xOverlap/2;
        }
    } else{
        if (dy < 0) {
          obj.pos.y -= yOverlap/2;
          other.pos.y += yOverlap/2;
        } else {
          obj.pos.y += yOverlap/2;
          other.pos.y -= yOverlap/2;
        }
    }
}

function fixCollisions(obj) {
  // fix object collisions
  physicsObjects.forEach((other) => {
    if (obj == other || obj == draggedObject || other == draggedObject) return;
    if (isColliding(obj,other)) resolveCollision(obj,other);      
  });

  let simulationHeight = document.body.clientHeight;
  let simulationWidth = document.body.clientWidth;

  // fix border collisions
  if (obj.pos.x < 0) {
    let vel = obj.pos.x - obj.prevPos.x;
    obj.pos.x = 0;
    obj.prevPos.x = vel * ENERGY_MULTIPLIER
  }

  if ((obj.pos.x + obj.rect.width) > simulationWidth) {
    let vel = obj.pos.x - obj.prevPos.x;
    obj.pos.x = simulationWidth - obj.rect.width;
    obj.prevPos.x = obj.pos.x + vel * ENERGY_MULTIPLIER
  }

  if (obj.pos.y < 0) {
    let vel = obj.pos.y - obj.prevPos.y;
    obj.pos.y = 0;
    obj.prevPos.y = vel * ENERGY_MULTIPLIER
  }

  if ((obj.pos.y + obj.rect.height) > simulationHeight) {
    let vel = obj.pos.y - obj.prevPos.y;
    obj.pos.y = simulationHeight - obj.rect.height;
    obj.prevPos.y = obj.pos.y + vel * ENERGY_MULTIPLIER
  }
}

function applyGravity(obj, dt) {
  let tempPos = { x: obj.pos.x, y: obj.pos.y };

  obj.pos.x = obj.pos.x * 2 - obj.prevPos.x + (((gravity.x * dt) / 1000) * dt) / 1000;
  obj.pos.y = obj.pos.y * 2 - obj.prevPos.y + (((gravity.y * dt) / 1000) * dt) / 1000;

  obj.prevPos = tempPos;
}

function physicsLoop(lastFrameTime) {
  let dt = Date.now() - lastFrameTime;
  lastFrameTime += dt;
  dt = Math.min(dt, 100);

  physicsObjects.forEach((obj) => {
    if (obj == draggedObject) return;
    applyGravity(obj, dt)
  })
  physicsObjects.forEach((obj) => {
    if (obj == draggedObject) return;
    fixCollisions(obj, dt)
    updateObjectPos(obj);
  })

  setTimeout(() => { physicsLoop(lastFrameTime) });
}

addClickListeners();

physicsLoop(Date.now());

var lastFrame = Date.now();
