//stores steps taken while solving current task
let steps = []; //steps
let storedSteps = []; //all steps (also with deleted and restored)
let currentStep = 0;
let canvasWidth = 942;
let canvasHeight = 640;

let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")

class Element{
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }

    draw(){
        switch(this.type){
            case "text":
                context.font = "20px Arial";
                context.fillText("Poznámky", 30, 50);
                break;
            default:
                return;
        }
    }

    delete(){
        switch(this.type){
            case "text":
                context.fillText("", 30, 50);
                break;
            default:
                return;
        }
    }
}

//deletes all steps
function deleteAll(){
    //if(steps.length !== 0) {
        steps = [] //empty the array with steps
        storedSteps = []
        currentStep = 0
        context.clearRect(0, 0, canvasWidth, canvasHeight) //clear canvas
        console.log("Delete all")
    //}
}

function undo(){
    if(steps.length > 0) {
        let element = steps.pop()
        currentStep--
    }
    console.log("undo")
}

function redo(){
    if(storedSteps.length > 1) {
        let element = storedSteps[storedSteps.length - 1]
        steps.push(element)
        currentStep++
    }
    console.log("redo")
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

    var input = document.createElement('input');

    input.type = 'text';
    input.id = "notes"
    input.style.color = "black"
    input.style.left = (30 - 4) + 'px';
    input.style.top = (50 - 4) + 'px';

    input.onkeydown = handleEnter;

    document.getElementById("inputArea").appendChild(input);

    input.focus();

    hasInput = true;
}

//Key handler for input box:
function handleEnter(e) {
    var keyCode = e.keyCode;
    if (keyCode === 13) {
        drawText(this.value, parseInt(this.style.left, 10), parseInt(this.style.top, 10));
        document.getElementById("inputArea").removeChild(this);
        hasInput = false;
    }
}

//Draw the text onto canvas:
function drawText(txt, x, y) {
    context.textBaseline = 'top';
    context.textAlign = 'left';
    context.font = "20px Arial";
    context.fillText(txt, x - 4, y - 4);
}