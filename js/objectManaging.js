import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {auth, db} from "./config.js"

//stores steps taken while solving current task
let steps = []; //steps
let storedSteps = []; //all steps (also with deleted and restored)
let currentStep = 0;
let inputArea = false;
let hasInput = false;

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
    setOffsets();
}

function setOffsets(){
    let canvasOffsets = canvas.getBoundingClientRect();
    offsetX = canvasOffsets.left;
    offsetY = canvasOffsets.top;
}

window.onresize = function () {setOffsets();}
canvas.onresize = function () {setOffsets();}
window.onscroll = function () {setOffsets();}

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
document.querySelector("#undo").onclick = function (){
    let message = "UNDO";
    if(currentStep > 0) {
        steps.pop();
        currentStep--;
        redrawCanvas();
        redoOk = true;
    }
}

document.querySelector("#redo").onclick = function (){
    if(redoOk) {
        let element = storedSteps[currentStep];
        steps.push(element);
        redrawCanvas();
        currentStep++;
        if(currentStep === storedSteps.length){redoOk = false;}
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
                context.textBaseline = "top";
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
document.querySelector("#text").onclick = function (){
    if(!inputArea) {
        const input = document.createElement('input');
        input.style.marginTop = "10px";

        input.type = 'text';
        input.id = "notes"
        input.style.color = "black"

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
        let element = new Element("text", {text: this.value, x: 50, y: 30, width: this.value.length*12, height: 20,color: "black"});
        steps.push(element);
        currentStep++;
        storedSteps.push(element);
        element.draw();
        document.getElementById("inputArea").removeChild(this);
        hasInput = false;
        inputArea = false;
    }
}

//dragging objects
let isDragging = false;
let currentIndex = 0;

//drawing with pen
let isPainting = false;
let lineWidth = 2;
let points = []; //array to store points while drawing

let startX;
let startY;

//pen only paints if button Pen was clicked, if another tools is in use, pen is off
let penOn = false;
document.querySelector("#pen").onclick = function (){ penOn = true }

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

let insideObject = function(x, y, object){
    let left = object.args.x;
    let right = object.args.x + object.args.width;
    let top = object.args.y;
    let bottom = object.args.y + object.args.height;

    return x >= left && x <= right && y >= top && y <= bottom;
}

canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();

    if(penOn) {
        isPainting = true;
        startX = e.clientX;
        startY = e.clientY;
    }

    startX = parseInt(e.clientX) - offsetX;
    startY = parseInt(e.clientY) - offsetY;

    //clicking on object and dragging it
    for(let i=0; i<steps.length; i++){
        if(insideObject(startX, startY, steps[i])){
            currentIndex = i;
            isDragging = true;
            canvas.style.cursor = "grab";
            return;
        }
    }
});

canvas.addEventListener('mouseup', e => {
    e.preventDefault();

    if(isPainting) {
        isPainting = false;
        if(!isDragging) {
            let element = new Element("line", {points: points, lineWidth, color: context.strokeStyle});
            steps.push(element);
            currentStep++;
            storedSteps.push(element);
            points = [];
            context.stroke();
            context.beginPath();
        }
    }

    if(isDragging){
        isDragging = false;
        canvas.style.cursor = "auto";
    }
});

canvas.addEventListener('mouseout', e => {
    e.preventDefault();

    if(isDragging){
        isDragging = false;
        canvas.style.cursor = "auto";
    }
});

canvas.addEventListener('mousemove', e => {
    e.preventDefault();
    if (isDragging){
        let mouseX = parseInt(e.clientX) - offsetX;
        let mouseY = parseInt(e.clientY) - offsetY;

        let dx = mouseX - startX;
        let dy = mouseY - startY;

        let current = steps[currentIndex];
        current.args.x += dx;
        current.args.y += dy;

        redrawCanvas();

        startX = mouseX;
        startY = mouseY;
    }

    if(isPainting && !isDragging){
        context.lineWidth = lineWidth;
        context.lineCap = 'round';

        context.lineTo(parseInt(e.clientX) - offsetX, parseInt(e.clientY) - offsetY);
        points.push({x: parseInt(e.clientX) - offsetX, y: parseInt(e.clientY) - offsetY});
        context.stroke();
    }
});


//highlighting of tool buttons
let prevButton;
let currentButton;

document.addEventListener('click', function(event) {
    let clickedElement = event.target;

    if (clickedElement.name === 'tool') {
        if(clickedElement.id !== "pen"){ penOff() }
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

export {deleteAll, setCanvas, steps, Element}