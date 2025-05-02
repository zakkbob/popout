var physicsObjects = [];

const FPS = 60;
const DELTA_MS = Math.floor(1000 / FPS);
const GRAVITY = 1000;

const SHOW_BOUNDING_BOXES = false;

var dragOffset = { x: 0, y: 0};
var selectedEl = null;
var lastTime = Date.now();
var prevMousePos = { x: 0, y: 0 };

document.body.setAttribute(
  "style",
  "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none; -ms-user-select: none;user-select: none;",
);

function addEventListeners() {
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
          onClick(e, el);
        });
      }
    });
}

function dragSelectedEl(e) {
  if (selectedEl == null) return;
  let dt = (Date.now() - lastTime) / 1000;
  let mouseVel = {
    y: (e.clientY - prevMousePos.y) / dt,
    x: (e.clientX - prevMousePos.x) / dt,
  };

  selectedEl.pos.x = e.clientX - dragOffset.x;
  selectedEl.pos.y = e.clientY - dragOffset.y;
  updateStylePos(selectedEl);

  selectedEl.prevPos.x = selectedEl.pos.x - mouseVel.x / 1000;
  selectedEl.prevPos.y = selectedEl.pos.y - mouseVel.y / 1000;

  prevMousePos = { x: e.clientX, y: e.clientY };
  lastTime = Date.now();
}

document.onmousemove = dragSelectedEl;

function onMouseDown(e, el) {
  e.stopImmediatePropagation();
  el.ignore = true;

  dragOffset.x = e.clientX - el.pos.x;
  dragOffset.y = e.clientY - el.pos.y;

  selectedEl = el;
}

function onMouseUp(e, el) {
  e.stopImmediatePropagation();
  el.ignore = false;
  selectedEl = null;
}

function onClick(e, el) {
  e.stopImmediatePropagation();
  let copy = document.createElement("div");
  el.draggable = false;
  let rect = el.getBoundingClientRect();

  copy.classList.add("applied");
  copy.top = rect.top;
  copy.pos = { x: rect.left, y: rect.top };
  copy.prevPos = { x: rect.left, y: rect.top + 3 };
  copy.rect = { width: rect.width, height: rect.height };

  copy.style.position = "fixed";
  copy.style.width = copy.rect.width + "px";
  copy.style.height = copy.rect.height + "px";
  copy.style.overflow = "clip";
  if (SHOW_BOUNDING_BOXES) {
    copy.style.borderColor = "red";
    copy.style.borderWidth = "1px";
    copy.style.borderStyle = "solid";
  }
  updateStylePos(copy);
  copy.style.zIndex = 100000;
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

function updateStylePos(el) {
  el.style.top = el.pos.y + "px";
  el.style.left = el.pos.x + "px";
}

function applyVerlet(el) {
  if (el.ignore) return;
  let tempPos = { x: el.pos.x, y: el.pos.y };
  el.pos.x = Math.max(
    Math.min(
      el.pos.x * 2 - el.prevPos.x + (((0 * DELTA_MS) / 1000) * DELTA_MS) / 1000,
      visualViewport.width - el.rect.width,
    ),
    0,
  );
  el.pos.y = Math.max(
    Math.min(
      el.pos.y * 2 -
        el.prevPos.y +
        (((GRAVITY * DELTA_MS) / 1000) * DELTA_MS) / 1000,
      visualViewport.height - el.rect.height,
    ),
    0,
  );
  el.prevPos = tempPos;
}

function fixCollisions(el) {
  if (el.ignore) return;
  physicsObjects.forEach((other) => {
    if (el == other) return;
    if (other.ignore) return;

    let yOverlap = other.pos.y - (el.pos.y + el.rect.height);
    let xOverlap = other.pos.x - (el.pos.x + el.rect.width);

    if (el.pos.y <= other.pos.y && el.pos.x <= other.pos.x) {
      if (yOverlap < 0 && xOverlap < 0) {
        el.pos.y += yOverlap / 2;
        other.pos.y -= yOverlap / 2;
      }
    }
  });
}

function processPhysics() {
  physicsObjects.forEach(applyVerlet);
  physicsObjects.forEach(fixCollisions);
  physicsObjects.forEach(updateStylePos);
}

setInterval(processPhysics, DELTA_MS);
setInterval(addEventListeners, 10);
