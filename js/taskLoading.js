//important variables / default values
let listOfTasks
var currentSet = 1
var currentTask = 1
let prevBtn = document.getElementById("prevTask")
let nextBtn = document.getElementById("nextTask")
prevBtn.classList.add('disabled')

//modal window -> list of tasks in given set
const modal = document.getElementById("myModal");

//modal window trash -> ensures if user wants to remove all content from canvas
const trashModal = document.getElementById("trashModal");

//modal window -> displays hint for current task
const helpModal = document.getElementById("helpModal");
const helpContent = document.getElementById("helpContent")
const resultModal = document.getElementById("resultModal")
//*********************************************************************

function displayModal() {
    modal.style.display = "block";
    document.getElementById("taskNum").style.color = "#f3e4bf"
    document.getElementById("taskText").style.color = "#f3e4bf"
}

function closeModal() {
    modal.style.display = "none";
    document.getElementById("taskNum").style.color = "#252c36"
    document.getElementById("taskText").style.color = "#252c36"
}

function displayTrashModal() {
    trashModal.style.display = "block";
}

function closeTrashModal() {
    trashModal.style.display = "none";
}

//displays help modal and loads hint for current task
function displayHelpModal() {
    helpModal.style.display = "block";
    let hintText = listOfTasks[currentTask-1].hint.toString().split("|")
    for(var i=0; i<hintText.length; i++){
        let content = document.createElement("p")
        content.style.fontSize = "1.2em"
        content.textContent = "~ " + hintText[i]
        helpContent.appendChild(content)
    }
}

function closeHelpModal() {
    helpModal.style.display = "none";
    while(helpContent.hasChildNodes()){
        helpContent.removeChild(helpContent.firstChild);
    }
}

function displayResultModal() {
    resultModal.style.display = "block";
}

function closeResultModal() {
    resultModal.style.display = "none";
    document.getElementById("correctLabel").style.display = "none";
    document.getElementById("incorrectLabel").style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
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
}

//redirection from options to task with respective task set
async function set(num) {
    document.getElementById("options").style.display = "none";
    document.getElementById("taskPage").style.display = "inline"
    currentSet = num
    let response = await fetch('tasks/' + num + '.json')
    listOfTasks = await response.json()
    loadListOfTasks()
    setTask(currentTask)
}

//sets the number and text of given task
function setTask(num){
    currentTask = num
    checkButtons(currentTask)
    num--;
    document.getElementById("taskNum").innerHTML = '<i class="fa fa-paperclip"></i>' + listOfTasks[num].number + '. úloha';
    document.getElementById("taskText").innerHTML = listOfTasks[num].text;
    deleteAll() //reset new canvas
}

function checkButtons(num){
    if(num === 1){prevBtn.classList.add('disabled');}
    if(num < listOfTasks.length){nextBtn.classList.remove('disabled');}
    if(num === listOfTasks.length){nextBtn.classList.add('disabled');}
    if(num > 1){prevBtn.classList.remove('disabled');}
}

//load list of tasks to modal window
function loadListOfTasks() {
    for (let i = 0; i < listOfTasks.length; i++) {
        let newElement = document.createElement("button")
        newElement.classList.add("listButton")
        newElement.type = "button"
        newElement.setAttribute('onclick', 'setTask(' + (i + 1).toString() + '), closeModal()')
        newElement.textContent = (i + 1).toString() + ". úloha - " + listOfTasks[i].keyword

        let newLabel = document.createElement("span")
        newLabel.classList.add("listLabel")
        if(i+1 < 5){
            newLabel.style.backgroundColor = "#447334"
            newLabel.innerHTML = "<i class='fa fa-thumbs-up'></i>"
        }else{
            newLabel.style.backgroundColor = "#a82a1c"
            newLabel.innerHTML = "<i class='fa fa-thumbs-down'></i>"
        }

        let newDiv = document.createElement("div")
        newDiv.appendChild(newElement)
        newDiv.appendChild(newLabel)

        let target = document.getElementById("list")
        target.appendChild(newDiv)
    }
    const u = document.createElement("u")
    u.textContent = "Zoznam úloh - " + currentSet + ". sada"
    document.getElementById("modalName").appendChild(u)
}

function prevTask(){
    if(currentTask >= 2) {
        currentTask--;
        checkButtons(currentTask)
        setTask(currentTask)
    }
}

function nextTask(){
    if(currentTask < listOfTasks.length) {
        currentTask++;
        checkButtons(currentTask)
        setTask(currentTask)
    }
}
