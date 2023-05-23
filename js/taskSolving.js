//stores steps taken while solving current task
let steps = []; //steps
let storedSteps = []; //all steps (also with deleted and restored)
let currentStep = 0;
let inputArea = false;
let hasInput = false;
let stroke = 2;

let canvas = document.getElementById("canvas");
let parent = document.getElementById('canvasArea');
let context = canvas.getContext("2d");
let toolbar = document.getElementById("penSettings");

let canvasWidth;
let canvasHeight;
let offsetX;
let offsetY;

//adjusting size of canvas
function setCanvas() {
    let nav = document.getElementById("nav");
    let col = document.getElementById("taskCol");
    let row = document.getElementById("canvasButtons");
    let footer = document.getElementById("footer");

    let parentHeight = window.innerHeight - nav.offsetHeight - col.offsetHeight - row.offsetHeight - footer.offsetHeight;
    parent.style.height = parentHeight + 'px';

    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    offsetX = ((window.innerWidth - parent.offsetWidth) / 2);
    offsetY = nav.offsetHeight + col.offsetHeight + row.offsetHeight - 10;
}

window.addEventListener('resize', function() {
    setCanvas();
});

//class for managing elements on canvas
class Element{
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }

    draw(){
        switch(this.type){
            //doplnit podla suboru na serveri
        }
    }
}

//deletes all steps
function deleteAll(){
    //if(steps.length !== 0) {
        steps = []; //empty the array with steps
        storedSteps = [];
        currentStep = 0;
        context.clearRect(0, 0, canvasWidth, canvasHeight); //clear canvas
    //}
}

function undo(){
    if(steps.length > 0) {
        let element = steps.pop();
        currentStep--;
    }
    console.log("undo");
}

function redo(){
    if(storedSteps.length > 1) {
        let element = storedSteps[storedSteps.length - 1];
        steps.push(element);
        currentStep++;
    }
    console.log("redo");
}

function checkResult(){
    let correctResult = listOfTasks[currentTask - 1].result.toString()
    let input = document.getElementById("searchTxt").value.toString();
    if(input !== ""){
        if(correctResult === input){
            document.getElementById("correctLabel").style.display = "block";
        }else{
            document.getElementById("incorrectLabel").style.display = "block";
        }
    }
}

function addInput() {
    if(!inputArea) {
        const input = document.createElement('input');
        input.style.marginTop = "10px";

        input.type = 'text';
        input.id = "notes"
        input.style.color = "black"
        input.style.left = (30 - 4) + 'px';
        input.style.top = (50 - 4) + 'px';

        input.onkeydown = handleEnter;

        document.getElementById("inputArea").appendChild(input);

        input.focus();

        hasInput = true;
        inputArea = true;
    }
}

//Key handler for input box:
function handleEnter(e) {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.getElementById("inputArea").removeChild(this);
        hasInput = false;
        inputArea = false;
    }
}

//Draw the text onto canvas:
function drawText(txt, x, y) {
    context.textBaseline = 'top';
    context.textAlign = 'left';
    context.font = "20px Arial";
    context.fillText(txt, x - 4, y - 4);
}


//kreslenie perom
let isPainting = false;
let lineWidth = 2;
let startX;
let startY;

//pen only paints if button Pen was clicked, if another tools is in use, pen is off
let penOn = false;
function pen(){
    penOn = true;
}

function penOff(){
    penOn = false;
}

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        canvas.style.caretColor = e.target.value;
        context.strokeStyle = e.target.value;
    }

    if(e.target.id === 'lineWidth') {
        lineWidth = e.target.value;
    }

});

const draw = (e) => {
    if(!isPainting) {
        return;
    }

    context.lineWidth = lineWidth;
    context.lineCap = 'round';

    context.lineTo(parseInt(e.clientX) - offsetX, parseInt(e.clientY) - offsetY);
    context.stroke();
}

canvas.addEventListener('mousedown', (e) => {
    if(penOn) {
        isPainting = true;
        startX = e.clientX;
        startY = e.clientY;
    }
});

canvas.addEventListener('mouseup', e => {
    isPainting = false;
    context.stroke();
    context.beginPath();
});

canvas.addEventListener('mousemove', draw);


let prevButton;
let currentButton;

document.addEventListener('click', function(event) {
    let clickedElement = event.target;

    if (clickedElement.name === 'tool') {
        if(currentButton != null){
            prevButton = currentButton;
            prevButton.style.backgroundColor = "#f3e4bf";
            currentButton.style.fontWeight = "normal";
        }
        currentButton = event.target;
        currentButton.style.backgroundColor = "#d2850b";
        currentButton.style.fontWeight = "bold";

        let inputElement = document.getElementById("inputArea");
        if(clickedElement.id !== "text" && inputElement.childNodes.length > 0){
            inputElement.removeChild(inputElement.firstChild);
            inputArea = false;
        }
    }
});