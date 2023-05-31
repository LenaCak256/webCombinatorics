import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {auth, db} from "./config.js";
import {currentUser, currentSet, currentTask} from "./taskLoading.js";
import {steps, Element} from "./objectManaging.js";

function convert(array){
    let result = [];
    array.forEach((e) =>{
        let object = JSON.parse(e);
        let type = object.type;
        delete object.type;
        let element = new Element(type, object);
        result.push(element);
    })
    return result;
}

document.querySelector("#result").onclick = async function () {
    let array = [];
    steps.forEach((step) => {
        step.args.type = step.type;
        array.push(JSON.stringify(step.args));
    });
    console.log(array);
    //document.getElementById("resultModal").style.display = "block";
    await firestore.setDoc(firestore.doc(firestore.collection(db, 'tasks')), {
        set: currentSet,
        task: currentTask,
        userID: currentUser.uid,
        solved: false,
        list: array
    });
}

document.querySelector("#load").onclick = async function () {
    if (currentUser) {
        const tasksRef = firestore.collection(db, "tasks");
        const q = firestore.query(tasksRef, firestore.where("userID", "==", currentUser.uid), firestore.where("set", "==", currentSet), firestore.where("task", "==", currentTask));

        const querySnapshot = await firestore.getDocs(q);
        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const array = doc.get("list");
                let steps = convert(array);
                steps.forEach(step =>{
                    step.draw();
                })
            });
        }
    }
}