var physicsObjects = [];

const FPS = 60;
const DELTA_MS = Math.floor(1000/FPS);
const GRAVITY = 1000;
const SCREEN_HEIGHT = visualViewport.height

document.querySelectorAll('button, div, a, input, select, textarea, img, svg, [tabindex]:not([tabindex="-1"])')
    .forEach(el => {
        el.removeAttribute("href");
        if (isVisible(el)) {
            el.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                let copy = document.createElement("div");
                let rect = el.getBoundingClientRect();

                copy.top = rect.top;
                copy.pos = { x: rect.left, y:  rect.top}
                copy.prevPos = { x: rect.left, y:  rect.top + 5}
                copy.rect = { width: rect.width, height: rect.height}

                copy.style.position = "fixed";
                copy.style.width = copy.rect.width + "px";
                copy.style.height = copy.rect.height + "px";
                copy.style.borderColor = "red";
                copy.style.borderWidth = "1px";
                copy.style.borderStyle = "solid";
                copy.style.overflow = "clip";
                updateStylePos(copy);
                copy.style.zIndex = 1000;
                copy.innerHTML = el.outerHTML;
                document.body.appendChild(copy);
                el.remove();

                console.log(copy);

                physicsObjects.push(copy);
            });
        }
    });

function isVisible(el) {
    const style = getComputedStyle(el);
    if (el.firstChild != null && el.firstChild.nodeType == 3) {
        return true;
    }
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
}

function updateStylePos(el) {
    el.style.top = el.pos.y + "px";
    el.style.left = el.pos.x + "px";
}

function applyVerlet(el) {
    let tempPos = {x: el.pos.x, y: el.pos.y}
    el.pos.x = el.pos.x * 2 - el.prevPos.x + 0 * DELTA_MS/1000 * DELTA_MS/1000
    el.pos.y = Math.max(Math.min(el.pos.y * 2 - el.prevPos.y + GRAVITY * DELTA_MS/1000 * DELTA_MS/1000, SCREEN_HEIGHT-el.rect.height),0)
    el.prevPos = tempPos
}

function processPhysics() {
    physicsObjects.forEach(applyVerlet);
    physicsObjects.forEach(updateStylePos);
}

setInterval(processPhysics, DELTA_MS);