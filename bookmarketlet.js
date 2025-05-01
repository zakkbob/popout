var physicsObjects = [];

const FPS = 200;
const DELTA_MS = Math.floor(1000 / FPS);
const GRAVITY = 1000;
const SCREEN_HEIGHT = visualViewport.height

const SHOW_BOUNDING_BOXES = true;

function addEventListeners() {
    document.querySelectorAll('button:not(.applied), div:not(.applied), a:not(.applied), input:not(.applied), select:not(.applied), textarea:not(.applied), img:not(.applied), svg:not(.applied), [tabindex]:not([tabindex="-1"]):not(.applied)')
        .forEach(el => {
            console.log("foind el");
            el.removeAttribute("href");
            el.classList.add("applied");
            if (isVisible(el)) {
                el.addEventListener('click', (e) => {
                    e.stopImmediatePropagation();
                    let copy = document.createElement("div");
                    let rect = el.getBoundingClientRect();

                    copy.classList.add("applied");
                    copy.top = rect.top;
                    copy.pos = { x: rect.left, y: rect.top }
                    copy.prevPos = { x: rect.left, y: rect.top + 5 }
                    copy.rect = { width: rect.width, height: rect.height }

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
                    console.log(copy);

                    physicsObjects.push(copy);
                });
            }
        });

}

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
    let tempPos = { x: el.pos.x, y: el.pos.y }
    el.pos.x = el.pos.x * 2 - el.prevPos.x + 0 * DELTA_MS / 1000 * DELTA_MS / 1000
    el.pos.y = Math.max(Math.min(el.pos.y * 2 - el.prevPos.y + GRAVITY * DELTA_MS / 1000 * DELTA_MS / 1000, SCREEN_HEIGHT - el.rect.height), 0)
    el.prevPos = tempPos
}

function fixCollisions(el) {
    physicsObjects.forEach((other) => {
        if (el == other) return;

        let yOverlap =  other.pos.y - (el.pos.y + el.rect.height)
        let xOverlap =  other.pos.x - (el.pos.x + el.rect.width)

        if (el.pos.y <= other.pos.y && el.pos.x <= other.pos.x) {
            console.log("heigher");
            console.log(yOverlap)
            if (yOverlap < 0 && xOverlap < 0) {
                el.pos.y += yOverlap/2;
                other.pos.y -= yOverlap/2;
            }
        }
    })
}

function processPhysics() {
    physicsObjects.forEach(applyVerlet);
    physicsObjects.forEach(fixCollisions);
    physicsObjects.forEach(updateStylePos);
}

setInterval(processPhysics, DELTA_MS);
setInterval(addEventListeners, 10);