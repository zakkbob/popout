document.querySelectorAll('button, div, a, input, select, textarea, img, svg, [tabindex]:not([tabindex="-1"])')
    .forEach(el => {
        el.removeAttribute("href");
        if (isVisible(el)) {
            el.addEventListener('click', (e) => {
                e.stopImmediatePropagation();
                let el_copy = document.createElement("div");
                let rect = el.getBoundingClientRect();

                el_copy.top = rect.top;
                el_copy.mass = rect.width * rect.height;
                el_copy.speed = -5 + Math.min(el_copy.mass/10000,4);

                el_copy.style.position = "absolute";
                el_copy.style.width = el.offsetWidth + "px";
                el_copy.style.height = el.offsetHeight + "px";
                el_copy.style.top = rect.top + "px";
                el_copy.style.left = rect.left + "px";
                el_copy.style.zIndex = 100;
                el_copy.innerHTML = el.outerHTML;
                document.body.appendChild(el_copy);
                el.remove();

                setInterval(() => { el_copy.speed += 1/10; el_copy.top += el_copy.speed; el_copy.style.top = el_copy.top + "px";}, 10);
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
