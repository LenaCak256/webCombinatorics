import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {auth, db} from "./config.js";
import {currentUser, currentSet, currentTask, listOfTasks, saveTask} from "./taskLoading.js";
import {steps, Element} from "./objectManaging.js";

function displaySkillModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    setTimeout(function () {
        let skillName = document.querySelector("#skillName");
        skillName.removeChild(skillName.firstChild);
        modal.style.display = 'none';
    }, 2000); // Change the duration (in milliseconds) as needed
}

function closeResultModal(){
    document.getElementById("resultModal").style.display = "none";
}

document.querySelector("#checkResult").onclick = function (){
    //document.getElementById("resultModal").style.display = "block";
}

document.querySelector("#closeResultModal").onclick = function () { closeResultModal() }

document.querySelector("#result").onclick = function (){
    /*let input = document.querySelector("#searchTxt");
    let value = input.value;
    let correctResult = listOfTasks[currentTask - 1].result;

    if(value === correctResult){
        document.querySelector("#correctLabel").style.display = "block";
        saveTask(true);
        updateSkills("factorial");
        closeResultModal();
        document.querySelector("#skillName").innerHTML = "<i class='fa fa-trophy' style='font-size: 1.5em'></i> Faktoriál";
        displaySkillModal();
        console.log("Získal si skill faktoriál !!! :)");
    }*/
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