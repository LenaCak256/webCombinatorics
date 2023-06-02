import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {auth, db} from "./config.js"

auth.onAuthStateChanged( user => {
    if (user) {
        document.getElementById("ups").style.display = "none";
        document.getElementById("tables").style.display = "inline";
        setData()
    } else {
        document.getElementById("ups").style.display = "flex";
        document.getElementById("tables").style.display = "none";
        unsetData();
    }
})

window.addEventListener('beforeunload', function(event) {
    unsetData();
});

function unsetData(){
    for(let i=1; i<=4; i++){
        let id = "tbody" + i;
        let element = document.getElementById(id);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

async function setData() {
    //solved tasks
    for (let num = 1; num <= 3; num++) {
        let setOfTasks = [];
        let response = await fetch('tasks/' + num + '.json')
        setOfTasks = await response.json()

        let id = "tbody" + num;
        let body = document.getElementById(id);

        const tasksRef = firestore.collection(db, "tasks");
        const q = firestore.query(tasksRef, firestore.where("userID", "==", auth.currentUser.uid), firestore.where("set", "==", num), firestore.where("solved", "==", true));
        let tasks = [];

        const querySnapshot = await firestore.getDocs(q);
        if(!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const taskNum = doc.get("task");
                tasks.push(taskNum);
            });
        }

        for (let i = 0; i < setOfTasks.length; i++) {
            let tr = document.createElement("tr");
            let tdName = document.createElement("td");
            let tdLabel = document.createElement("td");

            tdName.textContent = (i+1).toString() + ". úloha - " + setOfTasks[i].keyword
            tdName.style.border = "1px solid #20252d";
            tdName.style.textAlign = "left";
            tdName.style.paddingLeft = "5%";
            tdLabel.style.border = "1px solid #20252d";
            tdLabel.style.backgroundColor = "rgba(182,174,174,0.79)";

            if ((i === 1)) {
                tdName.style.borderTop = "1px solid transparent";
                tdLabel.style.borderTop = "1px solid transparent";
            }
            if (tasks.includes((i+1))) {
                tdLabel.style.backgroundColor = "#66a650";
                tdLabel.innerHTML = "<i class='fa fa-check'></i>";
            } else {
                tdLabel.textContent = "x";
            }

            tr.appendChild(tdName);
            tr.appendChild(tdLabel);
            body.appendChild(tr);
        }
    }

    //skills
    const skills = firestore.collection(db, "users");
    const q = firestore.query(skills, firestore.where('__name__', "==", auth.currentUser.uid));
    let list = [];

    const querySnapshot = await firestore.getDocs(q);
    if(!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
            list = doc.get("skills");
        });
    }

    if(list) {
        list.forEach((skill) => {
            let col = document.getElementById(skill);
            col.innerHTML = `<i class="fa fa-trophy" style="font-size: 1.2em"></i>`
            col.parentElement.classList.add("highlight");
        });
    }
}
