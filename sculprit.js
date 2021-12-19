body = document.getElementsByTagName('body')[0];
let expArea = document.getElementsByClassName('experiment')[0];

let statePrev = expArea.innerHTML;
let stateLatest = expArea.innerHTML;

let stateIndex = 0;
let htmlHistory = [];
htmlHistory[0] = expArea.innerHTML;
// console.log("stateIndex: ", stateIndex, "Array: ", htmlHistory.length);

let storedBG;
let selectedElement;

function captureChange(){
  htmlHistory = htmlHistory.slice(0, stateIndex + 1);
  stateIndex = htmlHistory.push(expArea.innerHTML) - 1;
}
function getClasses(element) {
  let classes = "";
  element.classList.forEach( item => classes += ' .' + item );
  return classes;
}
function locatorUpdate(element) {
  const locator = document.querySelector('.locator');
  if (element) {
    locator.querySelector('.itself .tagname').textContent = `<${element.tagName.toLowerCase()}`;
    locator.querySelector('.itself .idname').textContent = element.id ? `#${element.id}` : ' ';
    locator.querySelector('.itself .classname').textContent = getClasses(element);

    locator.querySelector('.parent .tagname').textContent = `<${element.parentNode.tagName.toLowerCase()}`;
    locator.querySelector('.parent .idname').textContent = element.parentNode.id ? `#${element.parentNode.id}` : ' ';
    locator.querySelector('.parent .classname').textContent = getClasses(element.parentNode);

    locator.querySelectorAll('.tagclosing').forEach(item => item.style = "display: inline !important");
  } else {
    locator.querySelector('.itself .tagname').textContent = '';
    locator.querySelector('.itself .idname').textContent = '';
    locator.querySelector('.itself .classname').textContent = '';

    locator.querySelector('.parent .tagname').textContent = '';
    locator.querySelector('.parent .idname').textContent = '';
    locator.querySelector('.parent .classname').textContent = '';

    locator.querySelectorAll('.tagclosing').forEach(item => item.style = "");
    locatorOff();
  }
}
function locatorOn() {
  const locator = document.querySelector('.locator')
  locator.classList.remove('d-none');
  locator.style = ` top:${event.pageY-322}px; left: ${event.pageX-130}px;`;
}
function locatorOff() {
  const locator = document.querySelector('.locator')
  locator.classList.add('d-none');
  locator.style = "";
}
function getHighlightedItem() {
  return document.querySelector('[data-sclprt-highlight]');
}
function getSelectedItem() {
  return document.querySelector('[data-sclprt-selected]');
}

/*===================================================
  ===================== Actions =====================
  ===================================================*/

// Undo
function a_Undo(){
  if ( stateIndex > 0 ){
    stateIndex -= 1;
    expArea.innerHTML = htmlHistory[stateIndex];
  }
}
// Redo
function a_Redo(){
  if ( stateIndex < htmlHistory.length - 1 ){
    stateIndex += 1;
    expArea.innerHTML = htmlHistory[stateIndex];
  }
}
// Select
function a_Select (event_target) {
  let element = getSelectedItem();
  locatorUpdate(event_target);
  locatorOn();
  if (element) { 
    element.removeAttribute('data-sclprt-selected');
    element.parentNode.removeAttribute('data-sclprt-selected-parent');
  }
  event_target.setAttribute('data-sclprt-selected','true');
  event_target.parentNode.setAttribute('data-sclprt-selected-parent','true');

}
// Deselect
function a_Deselect() {
  elements = document.querySelectorAll('[data-sclprt-selected]');
  elements.forEach( element => {
    element.removeAttribute('data-sclprt-selected');
    element.parentNode.removeAttribute('data-sclprt-selected-parent');
  });
  locatorUpdate();
}
// Expand Mode
function a_ExpandMode() {
  expArea.classList.toggle("selected-on");
}
// Toggle Highlight
function a_ToggleHighlight(event_target) {
  if (window.event.ctrlKey || window.event.altKey || window.event.shiftKey ) {  
    event_target.setAttribute('data-sclprt-highlight','true');
    if (getSelectedItem()) locatorOn();
  } else {
    a_Unhighlight(event_target);
    locatorOff();
  }
}
// Unhighlight
function a_Unhighlight(event_target) {
  event_target.removeAttribute('data-sclprt-highlight');
}
// Delete
function a_Delete(event_target) {
  event_target.parentNode.removeChild(event_target);
  captureChange();
  selectedElement = ""; 
}
// Copy
function a_Copy(event_target) {
  selectedElement = event_target.cloneNode(true);
}
// Cut
function a_Cut(event_target) {
  a_Copy(event_target);
  event_target.parentNode.removeChild(event_target);
  captureChange();
}
// Paste
function a_Paste(event_target) {
  selectedElement = selectedElement.cloneNode(true);
  event_target.parentNode.insertBefore(selectedElement, event_target);
  captureChange();
}
// Move Up
function a_MoveUp() {
  selectedElement = getSelectedItem();
  selectedElement.parentNode.insertBefore(selectedElement, selectedElement.previousSibling);
}
// Move Down
function a_MoveDown() {
  selectedElement = getSelectedItem();
  selectedElement.parentNode.insertBefore(selectedElement.nextSibling, selectedElement);
}
// Move Over
function a_MoveOver() {
  selectedElement = getSelectedItem();
  selectedElement.parentNode.insertBefore(selectedElement, selectedElement.previousElementSibling);
}
// Move Under
function a_MoveUnder() {
  selectedElement = getSelectedItem();
  selectedElement.parentNode.insertBefore(selectedElement.nextElementSibling, selectedElement);
}
// Move Out
function a_MoveOut() {
  selectedElement = getSelectedItem();
  selectedElement.parentNode.parentNode.insertBefore(selectedElement, selectedElement.parentNode);
}
// Move In
function a_MoveIn() {
  selectedElement = getSelectedItem();
  selectedElement.nextElementSibling.insertBefore(selectedElement, selectedElement.nextElementSibling.firstChild);
}

/*===================================================
  ================ Control Listeners ================
  ===================================================*/

// Ctrl + Click: Select
// Alt  + Click: Delete
expArea.addEventListener('click', (event) => {
  event.preventDefault();
  if (window.event.ctrlKey) { 
    a_Select (event.target);
  } else if (window.event.altKey) {
    a_Delete(event.target);
  }
});

// RClick: Undo
expArea.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  a_Undo();
});

// Mid-Click: Cut-Copy-Paste
expArea.addEventListener('mousedown', (event) => {
  if (typeof event === 'object') { 
    if (event.button === 1) { 
      event.preventDefault();

      // Copy: Shift + Mid-Click
      if (window.event.shiftKey) { a_Copy(event.target); }
      // Cut: Alt + Mid-Click
      else if (window.event.altKey) { a_Cut(event.target); } 
      // Paste: Mid-Click
      else { a_Paste(event.target); } 
    }
  }
});

// Mouse Move: Toggle Element Highlight
expArea.addEventListener('mousemove', (event) => {
  event.preventDefault();
  a_ToggleHighlight(event.target);
  element = getHighlightedItem();
  const locator = document.querySelector('.locator');
  locator.querySelector('.highlighted .tagname').textContent = `<${element.tagName.toLowerCase()}`;
  locator.querySelector('.highlighted .idname').textContent = element.id ? `#${element.id}` : ' ';
  locator.querySelector('.highlighted .classname').textContent = getClasses(element);

});

// Mouse Out: Unhighlight Element
expArea.addEventListener('mouseout', (event) => {
  event.preventDefault();
  a_Unhighlight(event.target)
});

// Ctrl Keyboard Controls
let keysPressed = {};
document.addEventListener('keydown', (event) => {
  keysPressed[event.key] = true;
  // Undo
  if (keysPressed['Control'] && event.key == 'z') { 
    a_Undo(); 
  }
  // Redo
  else if (keysPressed['Control'] && event.key == 'y') { 
    a_Redo();
  }
  // Move Out
  else if (keysPressed['Control'] && (event.key == 'ArrowUp' || event.key == 'ArrowLeft')) { 
    event.preventDefault();
    a_MoveOut();
    captureChange();
  }
  // Move In
  else if (keysPressed['Control'] && (event.key == 'ArrowDown' || event.key == 'ArrowRight')) { 
    event.preventDefault();
    a_MoveIn();
    captureChange();
  }
  // Move Over
  else if (keysPressed['Shift'] && (event.key == 'ArrowUp' || event.key == 'ArrowRight')) { 
    event.preventDefault();
    a_MoveOver();
    captureChange();
  }
  // Move Under
  else if (keysPressed['Shift'] && (event.key == 'ArrowDown' || event.key == 'ArrowLeft')) { 
    event.preventDefault();
    a_MoveUnder();
    captureChange();
  }
  locatorUpdate(getSelectedItem());      
});

// Move Element
document.addEventListener('keydown', (event) => {
  // Move Up
  if (event.key == 'ArrowUp' || event.key == 'ArrowLeft') { 
    event.preventDefault();
    a_MoveUp();
    captureChange();
  }
  // Move Down
  else if (event.key == 'ArrowDown' || event.key == 'ArrowRight') { 
    event.preventDefault();
    a_MoveDown();
    captureChange();
  }
  // Deselect Element
  else if (event.key == 'Escape') { 
    a_Deselect();
  }
  // Deselect Element
  else if (event.key == 'CapsLock') { 
    a_ExpandMode();
  }
});
document.addEventListener('keyup', (event) => {
    delete keysPressed[event.key];
});

/*
// Scroll Up-Down
let scale = 12;
expArea.addEventListener('wheel', (event) => {
  element = getSelectedItem();
  event.preventDefault();
  element.classList.remove(`col-${scale}`);
  scale += event.deltaY * -0.01;
  scale = Math.min(Math.max(1, scale), 12);
  element.classList.add(`col-${scale}`);
  captureChange();      
}, false); 
*/

/*===================================================
  ================= File Operations =================
  ===================================================*/
  
// Copy results to clipboard
let copycodeBtn = document.querySelector('button.copycode');
copycodeBtn.addEventListener('click', (event) => {
  let copyText = htmlHistory[stateIndex];
  let clipboardTemp = document.createElement("textarea");
  document.body.appendChild(clipboardTemp);
  clipboardTemp.value = copyText;
  clipboardTemp.select();
  document.execCommand("copy");
  window.setTimeout(document.body.removeChild(clipboardTemp), 5000);
});

// Save whole HTML file
function saveFile() {
  var htmlContent = [ '<!DOCTYPE html><html lang="en">'
                      + document.getElementsByTagName('html')[0].innerHTML 
                      + '</html'];
  var bl = new Blob(htmlContent, {type: "text/html"});
  var a = document.createElement("a");
  a.href = URL.createObjectURL(bl);
  a.download = "filename.html";
  a.hidden = true;
  document.body.appendChild(a);
  a.innerHTML = "something random - nobody will see this, it doesn't matter what you put here";
  a.click();
};

// Paste clipboard
async function pasteClipboard() {
  const copiedCode = await navigator.clipboard.readText();
  expArea.innerHTML = copiedCode;
  captureChange();
}

const dirRight = () => {
  document.querySelector(".experiment").classList.remove("dir-ltr", "text-left" );
  document.querySelector(".experiment").classList.add("dir-rtl", "text-right");
}

const dirLeft = () => {
  document.querySelector(".experiment").classList.remove("dir-rtl", "text-right");
  document.querySelector(".experiment").classList.add("dir-ltr", "text-left" );
}

const expandExp = () => {
  document.querySelector(".experiment").parentNode.parentNode.parentNode.classList.remove("container");
  document.querySelector(".experiment").parentNode.parentNode.parentNode.classList.add("container-fluid" );
}

const compressExp = () => {
  document.querySelector(".experiment").parentNode.parentNode.parentNode.classList.remove("container-fluid" );
  document.querySelector(".experiment").parentNode.parentNode.parentNode.classList.add("container");
}