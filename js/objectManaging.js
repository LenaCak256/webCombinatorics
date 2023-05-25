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

//deletes all steps
function deleteAll(){
    if(steps.length !== 0) {
        steps = []; //empty the array with steps
        storedSteps = [];
        currentStep = 0;
        clearCanvas();
    }
}

function clearCanvas(){
    context.clearRect(0, 0, canvasWidth, canvasHeight); //clear canvas
}

let redoOk = false;
function undo(){
    let message = "UNDO";
    if(currentStep > 0) {
        steps.pop();
        currentStep--;
        console.log(message, currentStep);
        redrawCanvas();
        redoOk = true;
    }
}

function redo(){
    let message = "REDO";
    if(redoOk) {
        let element = storedSteps[currentStep];
        steps.push(element);
        redrawCanvas();
        currentStep++;
        if(currentStep === storedSteps.length){redoOk = false;}
        console.log(message, currentStep);
    }
}


function redrawCanvas(){
    clearCanvas();
    for(let i=0; i<steps.length; i++){
        steps[i].draw();
    }
}

//class for managing elements on canvas
class Element{
    constructor(type, args) {
        this.type = type;
        this.args = args;
    }

    draw(){
        switch(this.type){
            case "text":{
                context.fillStyle = this.args.color;
                context.font = "20px Arial";
                context.fillText(this.args.text, this.args.x - 4, this.args.y - 4);
            }break;
            case "line":{
                context.beginPath();
                context.moveTo(this.args.points[0].x, this.args.points[0].y);

                for (let i = 1; i < this.args.points.length; i++) {
                    context.lineTo(this.args.points[i].x, this.args.points[i].y);
                }
                context.lineWidth = this.args.lineWidth;
                context.lineCap = 'round';
                context.strokeStyle = this.args.color;
                context.stroke();
                context.beginPath();
            }break;
        }
    }
}

//adds input element
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
        let element = new Element("text", {text: this.value, x: parseInt(this.style.left, 10), y: parseInt(this.style.top, 10), color: "black"});
        steps.push(element);
        currentStep++;
        console.log(steps, currentStep);
        storedSteps.push(element);
        element.draw();
        document.getElementById("inputArea").removeChild(this);
        hasInput = false;
        inputArea = false;
    }
}


//drawing with pen
let isPainting = false;
let lineWidth = 2;
let points = []; //array to store points while drawing
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
    points.push({x: parseInt(e.clientX) - offsetX, y: parseInt(e.clientY) - offsetY});
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
    let element = new Element("line", {points: points, lineWidth, color: context.strokeStyle});
    steps.push(element);
    currentStep++;
    storedSteps.push(element);
    console.log(steps, currentStep);
    points = [];
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