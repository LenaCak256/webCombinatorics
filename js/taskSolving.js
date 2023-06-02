import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {db} from "./config.js";
import {currentUser, currentSet, currentTask, listOfTasks, saveTask} from "./taskLoading.js";

const skills = new Map();
skills.set("11", ["factorial", "Faktoriál"]);
skills.set("14", ["combinations", "Kombinácie"]);
skills.set("15", ["variations", "Variácie"]);
skills.set("16", ["permutations", "Permutácie"]);

function displaySkillModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    setTimeout(function () {
        let skillName = document.querySelector("#skillName");
        skillName.removeChild(skillName.firstChild);
        modal.style.display = 'none';
    }, 2000);
}

function closeResultModal(){
    document.getElementById("resultModal").style.display = "none";
}

document.querySelector("#checkResult").onclick = function (){
    //document.getElementById("resultModal").style.display = "block";
}

document.querySelector("#closeResultModal").onclick = function () { closeResultModal() }

document.querySelector("#result").onclick = function (){
    let input = document.querySelector("#searchTxt");
    let value = input.value;
    let correctResult = listOfTasks[currentTask - 1].result;

    if(value === correctResult){
        document.querySelector("#correctLabel").style.display = "block";
        saveTask(true);
        let key = currentSet.toString() + currentTask.toString();
        let values = skills.get(key);
        if(values.length !== 0) {
            updateSkills(values[0]);
            closeResultModal();
            let html = "<i class='fa fa-trophy' style='font-size: 1.5em'></i> ";
            html = html + values[1];
            document.querySelector("#skillName").innerHTML = html;
            displaySkillModal();
        }
    }else{
        document.querySelector("#incorrectLabel").style.display = "block";
    }
}

async function checkSkills(skill) {
    const ref = firestore.doc(db, "users", currentUser.uid);
    const docSnap = await firestore.getDoc(ref);
    let skills = [];
    if(! docSnap.empty) {
        skills = docSnap.data().skills;
    }
    return !skills.includes(skill);
}

async function updateSkills(skill) {
    const ref = firestore.doc(db, "users", currentUser.uid);
    const docSnap = await firestore.getDoc(ref);

    if(! docSnap.empty){
        let skills = docSnap.data().skills;
        skills.push(skill);
        await firestore.updateDoc(ref, {
            skills: skills
        });
    }
}

export{checkSkills, updateSkills, displaySkillModal}