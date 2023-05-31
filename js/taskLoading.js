import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {auth, db} from "./config.js"
import {deleteAll, setCanvas} from "./objectManaging.js";

//important variables / default values
let listOfTasks
let currentSet = 1;
let currentTask = 1;
const prevBtn = document.querySelector("#prevTask");
const nextBtn = document.querySelector("#nextTask");
prevBtn.classList.add('disabled');

const tasksRef = firestore.collection(db, "tasks");
let currentUser = null;
let tasks = [];
let querySnapshot = null;
let q = null;

auth.onAuthStateChanged( async user => {
    if (user) {
        currentUser = user;
        q = firestore.query(tasksRef, firestore.where("userID", "==", auth.currentUser.uid), firestore.where("set", "==", currentSet), firestore.where("solved", "==", true));
    } else {
        currentUser = null;
    }
})

//modal window -> list of tasks in given set
const modal = document.getElementById("myModal");

//modal window trash -> ensures if user wants to remove all content from canvas
const trashModal = document.getElementById("trashModal");

//modal window -> displays hint for current task
const helpModal = document.getElementById("helpModal");

const helpContent = document.getElementById("helpContent");
const resultModal = document.getElementById("resultModal");
//*********************************************************************

document.querySelector("#closeModal").onclick = function () { closeModal() }

document.querySelector("#modalTrash").onclick = function () { trashModal.style.display = "block"}

document.querySelector("#closeTrash").onclick = function () { closeTrashModal() }

document.querySelector("#notDelete").onclick = function () { closeTrashModal() }

document.querySelector("#delete").onclick = function(){
    closeTrashModal();
    deleteAll();
}

function closeModal(){
    modal.style.display = "none";
    document.getElementById("taskNum").style.color = "#252c36";
    document.getElementById("taskText").style.color = "#252c36";
}

function closeTrashModal(){
    trashModal.style.display = "none";
}

//displays help modal and loads hint for current task
document.querySelector("#modalHelp").onclick = function () {
    helpModal.style.display = "block";
    let hintText = listOfTasks[currentTask-1].hint.toString().split("|")
    for(var i=0; i<hintText.length; i++){
        let content = document.createElement("p")
        content.style.fontSize = "1.2em"
        content.textContent = "~ " + hintText[i]
        helpContent.appendChild(content)
    }
}

document.querySelector("#closeHelp").onclick = function () {
    helpModal.style.display = "none";
    while(helpContent.hasChildNodes()){
        helpContent.removeChild(helpContent.firstChild);
    }
}

function closeResultModal() {
    resultModal.style.display = "none";
    document.getElementById("correctLabel").style.display = "none";
    document.getElementById("incorrectLabel").style.display = "none";
}

document.addEventListener('click', function(event) {
    if(event.target.name === "choose"){
        set(parseInt(event.target.id));
    }
    else if(event.target.name === "listButton"){
        let id = event.target.id.split(" ");
        setTask(parseInt(id[1]));
        closeModal();
    }
    else if (event.target === modal) {
        modal.style.display = "none";
        document.getElementById("taskNum").style.color = "#252c36"
        document.getElementById("taskText").style.color = "#252c36"
    }
    else if (event.target === trashModal || event.target === helpModal || event.target === resultModal) {
        if(event.target === resultModal){
            closeResultModal()
        }
        event.target.style.display = "none";
        while(helpContent.hasChildNodes()){
            helpContent.removeChild(helpContent.firstChild);
        }
    }
})

//redirection from options to task with respective task set
async function set(num) {
    document.getElementById("options").style.display = "none";
    document.getElementById("taskPage").style.display = "inline"
    currentSet = num
    if(currentUser){
        querySnapshot = await firestore.getDocs(q);
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const taskNum = doc.get("task");
                tasks.push(taskNum);
            });
        }
        for (let i = 1; i <= 10; i++) {
            if (!tasks.includes(i)) {
                currentTask = i;
                break;
            }
        }
    }
    let response = await fetch('tasks/' + num + '.json');
    listOfTasks = await response.json();
    setListName();
    setTask(currentTask);
    setCanvas();
}

//sets the number and text of given task
function setTask(num){
    currentTask = num
    checkButtons(currentTask)
    num--;
    document.getElementById("taskNum").innerHTML = '<i class="fa fa-paperclip"></i>' + listOfTasks[num].number + '. úloha';
    document.getElementById("taskText").innerHTML = listOfTasks[num].text;
    deleteAll(); //reset new canvas
    setCanvas();
}

function checkButtons(num){
    if(num === 1){prevBtn.classList.add('disabled');}
    if(num < listOfTasks.length){nextBtn.classList.remove('disabled');}
    if(num === listOfTasks.length){nextBtn.classList.add('disabled');}
    if(num > 1){prevBtn.classList.remove('disabled');}
}

//load list of tasks to modal window
async function loadListOfTasks() {

    if(currentUser) {
        tasks = [];
        querySnapshot = await firestore.getDocs(q);
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const taskNum = doc.get("task");
                tasks.push(taskNum);
            });
        }
    }

    let element = document.querySelector("#list");
    while(element.hasChildNodes()){
        element.removeChild(element.firstChild);
    }

    for (let i = 0; i < listOfTasks.length; i++) {
        let newElement = document.createElement("button");
        newElement.classList.add("listButton");
        newElement.name = "listButton";
        newElement.id = "task " + (i+1);
        newElement.textContent = (i + 1).toString() + ". úloha - " + listOfTasks[i].keyword;

        let newLabel = null;
        if(currentUser) {
            newLabel = document.createElement("button");
            newLabel.classList.add("listLabel");
            if (tasks.includes((i + 1))) {
                newLabel.style.backgroundColor = "#447334";
                newLabel.innerHTML = "<i class='fa fa-thumbs-up'></i>";
            } else {
                newLabel.style.backgroundColor = "#a82a1c";
                newLabel.innerHTML = "<i class='fa fa-thumbs-down'></i>";
            }
        }

        let newDiv = document.createElement("div");
        newDiv.classList.add("btn-group");
        newDiv.appendChild(newElement);
        if(currentUser){newDiv.appendChild(newLabel)}

        let target = document.getElementById("list");
        target.appendChild(newDiv);
    }
}

function setListName(){
    const u = document.createElement("u");
    u.textContent = "Zoznam úloh - " + currentSet + ". sada";
    document.getElementById("modalName").appendChild(u);
}

document.querySelector("#listOfTasks").onclick = async function () {
    await loadListOfTasks()
    modal.style.display = "block";
    document.getElementById("taskNum").style.color = "#f3e4bf"
    document.getElementById("taskText").style.color = "#f3e4bf"
}

prevBtn.onclick = function (){
    if(currentTask >= 2) {
        currentTask--;
        checkButtons(currentTask);
        setTask(currentTask);
    }
}

nextBtn.onclick = function (){
    if(currentTask < listOfTasks.length) {
        currentTask++;
        checkButtons(currentTask);
        setTask(currentTask);
    }
}

export {currentUser, currentSet, currentTask}