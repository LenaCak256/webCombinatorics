import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {auth, db} from "./config.js"

auth.onAuthStateChanged( user => {
    if (user) {
        document.getElementById("ups").style.display = "none";
        document.getElementById("tables").style.display = "inline";
        setData()
    } else {
        document.getElementById("ups").style.display = "flex";
        document.getElementById("tables").style.display = "none";
    }
})

async function setData() {
    for (let num = 1; num <= 4; num++) {
        let setOfTasks = [];
        let response = await fetch('tasks/' + num + '.json')
        setOfTasks = await response.json()

        let id = "tbody" + num;
        let body = document.getElementById(id);

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
            if (i === 1) {
                tdName.style.borderTop = "1px solid transparent";
                tdLabel.style.borderTop = "1px solid transparent";
            }
            if (i < 2) {
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
}
