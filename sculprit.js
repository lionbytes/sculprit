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
  } else {
    locator.querySelector('.itself .tagname').textContent = '';
    locator.querySelector('.itself .idname').textContent = '';
    locator.querySelector('.itself .classname').textContent = '';

    locator.querySelector('.parent .tagname').textContent = '';
    locator.querySelector('.parent .idname').textContent = '';
    locator.querySelector('.parent .classname').textContent = '';
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
  if(event_target.id !== "experiment" && !event_target.classList.contains("experiment")) {
    let element = getSelectedItem();
    locatorUpdate(event_target);
    locatorOn();
    if (element) { 
      element.removeAttribute('data-sclprt-selected');
      element.parentNode.removeAttribute('data-sclprt-selected-parent');
    }
    const sfx_prod = new Audio("prod.wav");
    sfx_prod.volume = 0.3;
    sfx_prod.play();

    event_target.setAttribute('data-sclprt-selected','true');
    event_target.parentNode.setAttribute('data-sclprt-selected-parent','true');
  }
}
// Deselect
function a_Deselect() {
  elements = document.querySelectorAll('[data-sclprt-selected]');
  elements.forEach( element => {
    element.removeAttribute('data-sclprt-selected');
  });

  parents = document.querySelectorAll('[data-sclprt-selected-parent]');
  parents.forEach( parent => {
    parent.removeAttribute('data-sclprt-selected-parent');
  });

  locatorUpdate();
}
// Expand Mode
function a_ExpandMode() {
  expArea.classList.toggle("selected-on");
}
// Toggle Highlight
function a_ToggleHighlight(event_target) {
    locatorOn();
    event_target.setAttribute('data-sclprt-highlight','true');
    document.querySelector("#selecteditem").style.display = (getSelectedItem()?  "block":"none");
}
// Unhighlight
function a_Unhighlight(event_target) {
  event_target.removeAttribute('data-sclprt-highlight');
}
// Copy
function a_Copy(event_target) {
  selectedElement = event_target.cloneNode(true);
  event_target.classList.add("copied");
  setTimeout(() => {
    event_target.classList.remove("copied");
  }, 200);
}
// Cut
function a_Cut(event_target) {
  a_Copy(event_target);
  event_target.classList.add("cut");
  setTimeout(() => {
    event_target.classList.remove("cut");
    event_target.parentNode.removeChild(event_target);
  }, 200);
  const sfx_occur = new Audio("occur.wav");
  sfx_occur.volume = 0.2;
  sfx_occur.play();
  captureChange();
}
// Paste
function a_Paste(event_target) {
  selectedElement = selectedElement.cloneNode(true);
  event_target.parentNode.insertBefore(selectedElement, event_target);
  selectedElement.classList.add("pasted");
  setTimeout(() => {
    selectedElement.classList.remove("pasted");
  }, 100);
  a_MoveUnder();
  const sfx_occur = new Audio("fyi.wav");
  sfx_occur.volume = 0.2;
  sfx_occur.play();
  captureChange();
}
// Delete
function a_Delete(event_target) {
  if(event_target.id !== "experiment" && !event_target.classList.contains("experiment")) {
    event_target.classList.add("destroyed");
    setTimeout(() => {
      event_target.classList.remove("destroyed");
      event_target.parentNode.removeChild(event_target);
    }, 100);
    const sfx_destroy = new Audio("destroy.wav");
    sfx_destroy.volume = 0.3;
    sfx_destroy.play();
    captureChange();
    selectedElement = ""; 
  }
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
// Edit Text
function a_EditText(event_target) {
  let inputstr = prompt("", event_target.textContent);
  if (inputstr === null) {
    return;
  }
  event_target.textContent = inputstr;
}
// Edit Classes
function a_EditClasses(event_target) {
  let classstr = prompt("", event_target.className);
  if (classstr === null) {
    return;
  }
  let classlist = classstr.split(" ");
  event_target.className = "";
  classlist.forEach(classitem => {
    event_target.classList.add(classitem);
  });
}
// Edit ID
function a_EditID(event_target) {
  let idstr = prompt("", event_target.id);
  if (idstr === null) {
    return;
  }
  event_target.id = idstr;
}

/*===================================================
  ================ Control Listeners ================
  ===================================================*/

// Double Click
expArea.addEventListener('dblclick', (event) => {
  event.preventDefault();
  if (window.event.ctrlKey) { 
    a_EditClasses(event.target);
  } else if (window.event.shiftlKey) { 
    a_EditID(event.target);
  } else {
    a_EditText(event.target);
  }
});

// Click
expArea.addEventListener('click', (event) => {
  if (typeof event === 'object') { 
    if (event.button === 0) {
      event.preventDefault();
      if (window.event.ctrlKey && window.event.shiftKey && window.event.altKey) { 
        // Paste
        a_Paste(event.target); 
      } else if (window.event.ctrlKey && window.event.altKey) { 
        // Cut
        a_Cut(event.target); 
      } else if (window.event.ctrlKey && window.event.shiftKey) {
        // Copy: Click
        a_Copy(event.target); 
      } else if (window.event.altKey) {
        // Delete
        a_Deselect();
        a_Delete(event.target);
      } else if (window.event.ctrlKey) {
        // Multi-select
        getSelectedItem() === event.target? a_Deselect() : a_Select (event.target);
      } else {
        // Select\Deselect
        getSelectedItem() === event.target? a_Deselect() : a_Select (event.target);
      }
    }
  }
});

// Paste: Mid-Click
expArea.addEventListener('mousedown', (event) => {
  if (typeof event === 'object') { 
    if (event.button === 1) { 
      event.preventDefault();
      a_Paste(event.target);
    }
  }
});



// RClick: Undo
/*expArea.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  a_Undo();
});*/

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
  // Delete Selected
  else if (event.key == 'Delete') { 
    selectedElement = getSelectedItem();
    let nextDelete = (
      selectedElement.nextElementSibling || selectedElement.previousElementSibling || selectedElement.parentNode
    );
    a_Delete(selectedElement);
    a_Select(nextDelete);   
    locatorOff();
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
  // Copy selected
  else if (keysPressed['Control'] && event.key == 'c') { 
    event.preventDefault();
    a_Copy(getSelectedItem());
  }
  // Cut selected
  else if (keysPressed['Control'] && event.key == 'x') { 
    event.preventDefault();
    a_Cut(getSelectedItem());
    a_Deselect();
  }
  // Paste selected
  else if (keysPressed['Control'] && event.key == 'v') {
    a_Paste(getSelectedItem());
    a_Deselect();
  }
  // Paste selected
  else if (event.key == 'F2') {
    a_EditText(getSelectedItem());
    a_Deselect();
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
    document.querySelector("#selecteditem").style.display = (getSelectedItem()?  "block":"none");
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