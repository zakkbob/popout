![badge showing time spent on this project](https://hackatime-badge.hackclub.com/U08PB6UEYLD/hacklet-submission)

# hacklet-submission
i have no ideas on what to call this, if you can think of something then please let me know


## What is this
This is a bookmarklet made for [Hacklet](https://hacklet.hackclub.com/0), a [Hack Club](https://hackclub.com/) event where you made a bookmarklet and get a free domain in return

It does this <br>
![Demo](https://github.com/zakkbob/hacklet-submission/blob/main/demos/it-does-this.gif?raw=true)
<br><br>
And sometimes this <br>
![Demo 2](https://github.com/zakkbob/hacklet-submission/blob/main/demos/sometimes-this.gif?raw=true)


## How do I install this
Just copy the code below and add it as a bookmark (it looks scary because its minified, I promise I won't steal your roblox session cookies)
``` javascript
javascript:(function()%7Bdocument.body.setAttribute(%22style%22%2C%22-webkit-touch-callout%3A%20none%3B-webkit-user-select%3A%20none%3B-khtml-user-select%3A%20none%3B-moz-user-select%3A%20none%3B%20-ms-user-select%3A%20none%3Buser-select%3A%20none%3B%22)%3Bconst%20SHOW_BOUNDING_BOXES%3D!1%3Bvar%20draggedObject%3Dnull%2CdragOffset%3D%7Bx%3A0%2Cy%3A0%7D%2CprevMousePos%3D%7Bx%3A0%2Cy%3A0%7D%2ClastMouseTime%3DDate.now()%3Bfunction%20dragSelectedObject(e)%7Bif(null%3D%3DdraggedObject)return%3Blet%20t%3D(Date.now()-lastMouseTime)%2F1e3%2Co%3D%7By%3A(e.clientY-prevMousePos.y)%2Ft%2Cx%3A(e.clientX-prevMousePos.x)%2Ft%7D%3BdraggedObject.pos.x%3De.clientX-dragOffset.x%2CdraggedObject.pos.y%3De.clientY-dragOffset.y%2CupdateObjectPos(draggedObject)%2CdraggedObject.prevPos.x%3DdraggedObject.pos.x-o.x%2F1e3%2CdraggedObject.prevPos.y%3DdraggedObject.pos.y-o.y%2F1e3%2CprevMousePos%3D%7Bx%3Ae.clientX%2Cy%3Ae.clientY%7D%2ClastMouseTime%3DDate.now()%7Dfunction%20onMouseDown(e%2Ct)%7Be.stopImmediatePropagation()%2CdragOffset.x%3De.clientX-t.pos.x%2CdragOffset.y%3De.clientY-t.pos.y%2CdraggedObject%3Dt%7Dfunction%20onMouseUp(e%2Ct)%7Be.stopImmediatePropagation()%2CdraggedObject%3Dnull%7Dfunction%20addClickListeners()%7Bdocument.querySelectorAll('button%3Anot(.applied)%2C%20div%3Anot(.applied)%2C%20a%3Anot(.applied)%2C%20input%3Anot(.applied)%2C%20select%3Anot(.applied)%2C%20textarea%3Anot(.applied)%2C%20img%3Anot(.applied)%2C%20svg%3Anot(.applied)%2C%20%5Btabindex%5D%3Anot(%5Btabindex%3D%22-1%22%5D)%3Anot(.applied)').forEach(e%3D%3E%7Bconsole.log(%22foind%20el%22)%2Ce.removeAttribute(%22href%22)%2Ce.classList.add(%22applied%22)%2CisVisible(e)%26%26e.addEventListener(%22click%22%2Ct%3D%3E%7BhandleClick(t%2Ce)%7D)%7D)%7Dfunction%20isVisible(e)%7Blet%20t%3DgetComputedStyle(e)%3Breturn%20null!%3De.firstChild%26%263%3D%3De.firstChild.nodeType%7C%7C%22none%22!%3D%3Dt.display%26%26%22hidden%22!%3D%3Dt.visibility%26%26null!%3D%3De.offsetParent%7Dfunction%20handleClick(e%2Ct)%7Be.stopImmediatePropagation()%2CpopOut(t)%7Dfunction%20updateObjectPos(e)%7Be.style.top%3De.pos.y%2B%22px%22%2Ce.style.left%3De.pos.x%2B%22px%22%7Dfunction%20popOut(e)%7Blet%20t%3Ddocument.createElement(%22div%22)%2Co%3Ddocument.body.getBoundingClientRect()%2Cs%3De.getBoundingClientRect()%3Bt.classList.add(%22applied%22)%2Ct.pos%3D%7Bx%3As.left-o.left%2Cy%3As.top-o.top%7D%2Ct.prevPos%3D%7Bx%3At.pos.x%2Cy%3At.pos.y%2B3%7D%2Ct.rect%3D%7Bwidth%3As.width%2Cheight%3As.height%7D%2Ct.style.position%3D%22absolute%22%2Ct.style.width%3Dt.rect.width%2B%22px%22%2Ct.style.height%3Dt.rect.height%2B%22px%22%2Ct.style.overflow%3D%22clip%22%2Ct.style.zIndex%3D1e5%2CupdateObjectPos(t)%2Ce.draggable%3D!1%2Ct.innerHTML%3De.outerHTML%2Cdocument.body.appendChild(t)%2Ce.remove()%2Ct.addEventListener(%22mousedown%22%2Ce%3D%3E%7BonMouseDown(e%2Ct)%7D)%2Ct.addEventListener(%22mouseup%22%2Ce%3D%3E%7BonMouseUp(e%2Ct)%7D)%2CphysicsObjects.push(t)%7Ddocument.onmousemove%3DdragSelectedObject%3Bconst%20ENERGY_MULTIPLIER%3D.2%3Bvar%20physicsObjects%3D%5B%5D%2Cgravity%3D%7Bx%3A0%2Cy%3A1e3%7D%3Bfunction%20isColliding(e%2Ct)%7Breturn%20e.pos.x%2Be.rect.width%3E%3Dt.pos.x%26%26e.pos.x%3C%3Dt.pos.x%2Bt.rect.width%26%26e.pos.y%2Be.rect.height%3E%3Dt.pos.y%26%26e.pos.y%3C%3Dt.pos.y%2Bt.rect.height%7Dfunction%20resolveCollision(e%2Ct)%7Bdx%3De.pos.x%2Be.rect.width%2F2-(t.pos.x%2Bt.rect.width%2F2)%2Cdy%3De.pos.y%2Be.rect.height%2F2-(t.pos.y%2Bt.rect.height%2F2)%2C(xOverlap%3D(e.rect.width%2Bt.rect.width)%2F2-Math.abs(dx))%3C(yOverlap%3D(e.rect.height%2Bt.rect.height)%2F2-Math.abs(dy))%3Fdx%3C0%3F(e.pos.x-%3DxOverlap%2F2%2Ct.pos.x%2B%3DxOverlap%2F2)%3A(e.pos.x%2B%3DxOverlap%2F2%2Ct.pos.y-%3DxOverlap%2F2)%3Ady%3C0%3F(e.pos.y-%3DyOverlap%2F2%2Ct.pos.y%2B%3DyOverlap%2F2)%3A(e.pos.y%2B%3DyOverlap%2F2%2Ct.pos.y-%3DyOverlap%2F2)%7Dfunction%20fixCollisions(e)%7BphysicsObjects.forEach(t%3D%3E%7Be!%3Dt%26%26e!%3DdraggedObject%26%26t!%3DdraggedObject%26%26isColliding(e%2Ct)%26%26resolveCollision(e%2Ct)%7D)%3Blet%20t%3Ddocument.body.clientHeight%2Co%3Ddocument.body.clientWidth%3Bif(e.pos.x%3C0)%7Blet%20s%3De.pos.x-e.prevPos.x%3Be.pos.x%3D0%2Ce.prevPos.x%3D.2*s%7Dif(e.pos.x%2Be.rect.width%3Eo)%7Blet%20i%3De.pos.x-e.prevPos.x%3Be.pos.x%3Do-e.rect.width%2Ce.prevPos.x%3De.pos.x%2B.2*i%7Dif(e.pos.y%3C0)%7Blet%20p%3De.pos.y-e.prevPos.y%3Be.pos.y%3D0%2Ce.prevPos.y%3D.2*p%7Dif(e.pos.y%2Be.rect.height%3Et)%7Blet%20n%3De.pos.y-e.prevPos.y%3Be.pos.y%3Dt-e.rect.height%2Ce.prevPos.y%3De.pos.y%2B.2*n%7D%7Dfunction%20applyGravity(e%2Ct)%7Blet%20o%3D%7Bx%3Ae.pos.x%2Cy%3Ae.pos.y%7D%3Be.pos.x%3D2*e.pos.x-e.prevPos.x%2Bgravity.x*t%2F1e3*t%2F1e3%2Ce.pos.y%3D2*e.pos.y-e.prevPos.y%2Bgravity.y*t%2F1e3*t%2F1e3%2Ce.prevPos%3Do%7Dfunction%20physicsLoop(e)%7Blet%20t%3DDate.now()-e%3Be%2B%3Dt%2Ct%3DMath.min(t%2C100)%2CphysicsObjects.forEach(e%3D%3E%7Be!%3DdraggedObject%26%26applyGravity(e%2Ct)%7D)%2CphysicsObjects.forEach(e%3D%3E%7Be!%3DdraggedObject%26%26(fixCollisions(e%2Ct)%2CupdateObjectPos(e))%7D)%2CsetTimeout(()%3D%3E%7BphysicsLoop(e)%7D)%7DaddClickListeners()%2CphysicsLoop(Date.now())%3Bvar%20lastFrame%3DDate.now()%3B%7D)()%3B
```

## How do i use this
Just click the bookmark and start pressing random things on the webpage

## Features
- [x] Ultra realistic physics simulation
- [x] Objects can be dragged and thrown
- [ ] Settings menu


## Random demos
![Bouncing google logo demo](https://github.com/zakkbob/hacklet-submission/blob/main/demos/dvd-logo.gif?raw=true)
