import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {db} from "./config.js";
import {currentSet, currentTask, currentUser, listOfTasks, saveTask} from "./taskLoading.js";

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

let result = []
document.querySelector("#addResult").onclick = function (){
    let option = document.querySelector('input[name="resultOption"]:checked').value;
    let input = document.querySelector("#inputResult").value;
    let display = document.querySelector("#displayResult");
    if(option === "factorial"){
        input += "!";
    }
    result.push(input);
    display.innerHTML = `</p>` + input + `</p>`;
}

document.querySelector("#result").onclick = function (){
    let correctResult = listOfTasks[currentTask - 1].result;
    let value = result[0];
    document.querySelector("#unknownLabel").style.display = "none";
    if(value === correctResult){
        document.querySelector("#correctLabel").style.display = "inline";
        saveTask(true);
        let key = currentSet.toString() + currentTask.toString();
        let values = skills.get(key);
        if(values.length !== 0) {
            let check = checkSkills(values[0]).then();
            if(check){
                updateSkills(values[0]).then(p => {
                    let html = "<i class='fa fa-trophy' style='font-size: 1.5em'></i> ";
                    html = html + values[1];
                    document.querySelector("#skillName").innerHTML = html;
                    displaySkillModal();
                });
            }
        }
    }else{
        document.querySelector("#incorrectLabel").style.display = "inline";
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