import {Element, setCurrentStep, steps, storedSteps} from "./objectManaging.js";
import {currentSet, currentTask, currentUser, savePascalSteps, saveTask, setSaved} from "./taskLoading.js";
import {displaySkillModal, updateSkills, checkSkills} from "./taskSolving.js";

const canvasArea = document.querySelector("#canvasArea");
const canvas = document.querySelector("#canvas");

let tools = [];
let helpTools = [];

export function addDragAndDrop(tool){
    const wrapper = tool,
        header = wrapper.querySelector(".objectCaption");

    function onDrag({movementX, movementY}){
        let getStyle = window.getComputedStyle(wrapper);
        let leftVal = parseInt(getStyle.left);
        let topVal = parseInt(getStyle.top);
        wrapper.style.left = `${leftVal + movementX}px`;
        wrapper.style.top = `${topVal + movementY}px`;
    }

    header.addEventListener("mousedown", ()=>{
        header.classList.add("active");
        header.addEventListener("mousemove", onDrag);
    });

    document.addEventListener("mouseup", ()=>{
        header.classList.remove("active");
        header.removeEventListener("mousemove", onDrag);

        steps.forEach((step) => {
            if(step.type === "tool" && step.args.id === wrapper.id){
                step.args.x = wrapper.style.left;
                step.args.y = wrapper.style.top;
            }
        })
    });
}

function loadTools(set, task){
    clearHelpTools();
    clearCanvasArea();

    if(set === 1 && task === 1){
        //help tool for task 1.1
        let tool = document.createElement("div");
        tool.classList.add("object");
        tool.innerHTML = `
        <div style="text-align: center"><label class="objectCaption">Klikni na 2 obrázky a vymeň ich</label></div>
        <div class="container" style="padding: 5px; width: max-content">
            <div class="col-sm-3" id="e1" style="padding: 3px; margin: 3px; background-color: white; width: 100px"><img src="../images/cardA.svg" height="180px" width="90px"></div>
            <div class="col-sm-3" id="e2" style="padding: 3px; margin: 3px; background-color: white; width: 100px"><img src="../images/card10.svg" height="180px" width="90px"></div>
            <div class="col-sm-3" id="e3" style="padding: 3px; margin: 3px; background-color: white; width: 100px"><img src="../images/card6.svg" height="180px" width="90px"></div>
            <div class="col-sm-3" id="e4" style="padding: 3px; margin: 3px; background-color: white; width: 100px"><img src="../images/cardJ.svg" height="180px" width="90px"></div>
        </div>
    `;
        addDragAndDrop(tool);
        helpTools.push(tool);
        canvasArea.insertBefore(tool, canvas);

        const element1 = document.getElementById("e1");
        const element2 = document.getElementById("e2");
        const element3 = document.getElementById("e3");
        const element4 = document.getElementById("e4");

// Add click event listeners to the elements
        element1.addEventListener("click", swapContent);
        element2.addEventListener("click", swapContent);
        element3.addEventListener("click", swapContent);
        element4.addEventListener("click", swapContent);
    }
    if(set === 1 && task === 8){
        //display picture and tools for Pascal triangle
        document.querySelector("#displayPascal").style.display = "flex";
        document.getElementById("checkPascal").style.backgroundColor = "#95a5a6";
    }else { document.querySelector("#displayPascal").style.display = "none";}
}

let selectedElements = [];
// Function to swap the content of two elements
function swapContent() {
    // Check if two elements are clicked
    if (selectedElements.length < 2) {
        // Add clicked element to the array
        selectedElements.push(this);
        this.classList.add("selected");
    }

    // If two elements are clicked, swap their content
    if (selectedElements.length === 2) {
        const temp = selectedElements[0].innerHTML;
        selectedElements[0].innerHTML = selectedElements[1].innerHTML;
        selectedElements[0].style.backgroundColor = "#f3a620";
        selectedElements[1].innerHTML = temp;
        selectedElements[1].style.backgroundColor = "#f3a620";

        setTimeout(function() {
            selectedElements[0].style.backgroundColor = "white";
            selectedElements[1].style.backgroundColor = "white";// Reset to default background color
            // Clear the selected elements array and remove the "selected" class
            selectedElements[0].classList.remove("selected");
            selectedElements[1].classList.remove("selected");
            selectedElements = [];
        }, 1000); // 1000 milliseconds = 1 second}
    }
}

function addTool(tool){
    let newTool = new Element("tool", {id: tool.id, inner: tool.innerHTML, x: tool.style.left,y: tool.style.top, tag: tool.tagName.toLowerCase()});
    if(! tools.includes(tool)){
        steps.push(newTool);
        storedSteps.push(newTool);
        setSaved(false);
        setCurrentStep();
        tools.push(tool);
        addDragAndDrop(tool);
    }
    console.log("ADDTOOL",steps);
    console.log("TOOLS", tools);
}

function clearCanvasArea(){
    while(tools.length){
        canvasArea.removeChild(tools.pop())
    }
}

function clearHelpTools(){
    while(helpTools.length){
        canvasArea.removeChild(helpTools.pop())
    }
}

document.querySelector("#allOptions").onclick = function (){
    document.getElementById("optionsForm").style.display = "inline";
}

function permutations(value){
    let result = [];

    function permute(currentStr, remainingChars) {
        if (remainingChars.length === 0) {
            result.push(currentStr);
        } else {
            for (let i=0; i < remainingChars.length; i++) {
                let newRemainingChars = remainingChars.slice(0, i) + remainingChars.slice(i + 1);
                permute(currentStr + remainingChars[i], newRemainingChars);
            }
        }
    }
    permute("", value);
    return result;
}

function permutationsR(value){
    let result = [];

    function permute(currentStr, remainingChars) {
        if (currentStr.length === str.length) {
            result.push(currentStr);
        } else {
            for (let i = 0; i < value.length; i++) {
                permute(currentStr + value[i], remainingChars);
            }
        }
    }
    permute("", value);
    return result;
}

function variations(value, num){
    let result = [];

    function generate(currentVariation, remainingChars, length) {
        if (currentVariation.length === length) {
            result.push(currentVariation);
        } else {
            for (let i = 0; i < remainingChars.length; i++) {
                generate(currentVariation + remainingChars[i], remainingChars.slice(0, i) + remainingChars.slice(i + 1), length);
            }
        }
    }
    generate("", value, num);
    return result;
}

function variationsR(value, num){
    let result = [];

    function generate(currentVariation, length) {
        if (currentVariation.length === length) {
            result.push(currentVariation);
        } else {
            for (let i = 0; i < value.length; i++) {
                generate(currentVariation + value[i], length);
            }
        }
    }
    generate("", num);
    return result;
}

function combinations(value, num){
    let result = [];

    function generate(currentCombination, start) {
        if (currentCombination.length === num) {
            result.push(currentCombination);
        } else {
            for (let i = start; i < value.length; i++) {
                generate(currentCombination + value[i], i + 1);
            }
        }
    }
    generate("", 0);
    return result;
}

function combinationsR(value, num){
    let result = [];

    function generate(currentCombination, start) {
        if (currentCombination.length === num) {
            result.push(currentCombination);
        } else {
            for (let i = start; i < value.length; i++) {
                generate(currentCombination + value[i], i);
            }
        }
    }
    generate("", 0);
    return result;
}

function assignRandomId(element) {
    let characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomId = '';

    for (let i = 0; i < 8; i++) {
        let randomIndex = Math.floor(Math.random() * characters.length);
        randomId += characters.charAt(randomIndex);
    }
    element.id = randomId;
}

const form = document.querySelector("#optionsForm");
form.addEventListener("submit", function (event){
    event.preventDefault();

    let numOfItems = parseInt(document.getElementById("number").value);
    let items = document.getElementById("inputWarning").value;
    let repeat = document.querySelector('input[name="opakovanie"]:checked').value;
    let order = document.querySelector('input[name="poradie"]:checked').value;
    console.log(items, items.length);
    console.log(numOfItems);

    //generate options with functions
    let options = [];

    if(repeat === "false" && order === "false"){
        options = combinations(items, numOfItems);
    }
    if(repeat === "true" && order === "false"){
        options = combinationsR(items, numOfItems);
    }
    if(repeat === "false" && order === "true"){
        if(numOfItems === items.length){
            options = permutations(items);
        }else{
            options = variations(items, numOfItems);
        }
    }
    if(repeat === "ture" && order === "true"){
        if(numOfItems === items.length){
            options = permutationsR(items);
        }else{
            options = variationsR(items, numOfItems);
        }
    }

    let tool = document.createElement("div");
    tool.classList.add("object");
    assignRandomId(tool);
    tool.innerHTML = `
          <div style="text-align: center"><label class="objectCaption">Všetky možnosti</label></div> 
          <div id="optionsContent" style="padding: 4px; overflow: auto; height: 200px; width: auto; background-color: white; color: black">
          </div>
    `;
    addDragAndDrop(tool);
    canvasArea.insertBefore(tool, canvas);
    let content = document.querySelector("#optionsContent");
    options.forEach((option) => {
        let p = document.createElement("p");
        p.style.color = "black";
        p.style.textAlign = "center";
        p.style.fontSize = "1.3em";
        p.textContent = option;
        content.appendChild(p);
    })
    addTool(tool);
    document.getElementById("optionsForm").style.display = "none";
})

document.querySelector("#changePos").onclick = function (){
    let items = document.getElementById("changeInput").value;
    document.getElementById("changeInput").value = "";
    if(items){
        let tool = document.createElement("div");
        tool.classList.add("object");
        assignRandomId(tool);
        tool.innerHTML = `
          <div style="text-align: center"> <label class="objectCaption">Klikni na 2 prvky a vymeň ich</label></div>
          <div id="changeContent" style="padding: 10px; width: max-content; height: 80px; background-color: #254d17; color: black; display: flex; gap: 10px;">
          </div>
    `;
        addDragAndDrop(tool);
        canvasArea.insertBefore(tool, canvas);
        let content = document.querySelector("#changeContent");
        for(let i=0; i< items.length; i++){
            let label = document.createElement("label");
            label.classList.add("chooseLabel");
            label.textContent = items[i];
            label.addEventListener("click", swapContent);
            content.appendChild(label);
        }
        addTool(tool);
    }
}

document.querySelector("#choosePos").onclick = function (){
    let num = document.getElementById("chooseInput").value;
    document.getElementById("chooseInput").value = "";
    if(num !== "" && num > 1){
        let tool = document.createElement("div");
        tool.classList.add("object");
        assignRandomId(tool);
        tool.innerHTML = `
          <div style="text-align: center"><label class="objectCaption">Umiestňuj prvky podľa potreby</label></div>
          <div id="chooseContent" style="padding: 10px; width: max-content; height: 80px; background-color: #254d17; color: black; display: flex; gap:3px;">
          </div>
    `;
        addDragAndDrop(tool);
        canvasArea.insertBefore(tool, canvas);
        let content = document.querySelector("#chooseContent");
        for(let i=0; i < num; i++){
            let input = document.createElement("input");
            input.classList.add("posInput");

            let div = document.createElement("div");
            div.classList.add("divideDiv");
            div.textContent = " | ";

            content.appendChild(input);
            if(i < num-1){
                content.appendChild(div);
            }

        }
        addTool(tool);
    }
}

document.querySelector("#checkPascal").onclick = function (){
    let inputs = document.querySelectorAll(".pascalInput");
    let result = true;
    inputs.forEach(input => {
        let value = input.value;
        if(value !== input.name){
            result = false;
        }
    })
    let btn = document.querySelector("#checkPascal");
    if(result){
        btn.style.backgroundColor = "green";
        if(currentUser){
            savePascalSteps();
            saveTask(true);
            let check = checkSkills("pascal").then(p => {});
            console.log("Check", check);
            if(check) {
                updateSkills("pascal").then(p => {
                    document.querySelector("#skillName").innerHTML = "<i class='fa fa-trophy' style='font-size: 1.5em'></i> Pascalov trojuholník";
                    displaySkillModal();
                });
            }
        }
    }else{
        btn.style.backgroundColor = "red";
    }
}

export {tools, clearCanvasArea, loadTools}