import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import {db} from "./config.js";
import {currentSet, currentTask, currentUser, listOfTasks, saveTask} from "./taskLoading.js";
const skills = new Map();
skills.set("11", ["factorial", "Faktoriál"]);
skills.set("14", ["combinations", "Kombinácie"]);
skills.set("15", ["variations", "Variácie"]);
skills.set("16", ["permutations", "Permutácie"]);
skills.set("21", ["permutationsR", "Permutácie s opakovaním"]);
skills.set("28", ["combinationsR", "Kombinácie s opakovaním"]);
skills.set("22", ["variationsR", "Variáce s opakovaním"]);
skills.set("31", ["IE", "Princíp inklúzie a exklúzie"]);

function displaySkillModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';

    setTimeout(function () {
        let skillName = document.querySelector("#skillName");
        skillName.removeChild(skillName.firstChild);
        modal.style.display = 'none';
    }, 2000);
}

class Binom{
    constructor(n, k) {
        this.n = n;
        this.k = k;
    }

    getValue(){
        return math.combinations(this.n, this.k);
    }

    getTex(){
        return "\\binom{" + this.n + "}{" + this.k + "}";
    }

    toJson(){
        return {type: 'binom', n: this.n, k: this.k };
    }
}

class Frac{
    constructor(n, k) {
        this.n = n;
        this.k = k;
    }

    getValue(){
        let numerator = math.evaluate(this.n);
        let denominator = math.evaluate(this.k);

        return math.fraction(numerator, denominator);
    }

    getTex(){
        return "\\frac{" + this.n + "}{" + this.k + "}";
    }

    toString(){
        return {type: 'frac', n: this.n, k: this.k};
    }
}

let result = []

function displayResult(){
    let string = "";
    let display = document.querySelector("#displayResult");

    if(result.length) {
        result.forEach(item => {
            if(item instanceof Binom){
                string += item.getTex();
            }else if (item instanceof Frac){
                string += item.getTex();
            }
            else{
                string += item;
            }
        })
    }
    if(string === ""){
        display.innerHTML = '';
    }else {
        display.innerHTML = '<p> $' + string + '$</p>';
        MathJax.typesetPromise([display]).then(() => {
            //console.log('MathJax typesetting complete');
        });
    }
}

function countResult(array){
    let output = "";

    if(array.length === 1){
        let element = array[0];
        if(element instanceof Binom || element instanceof Frac){
            return math.evaluate(element.getValue().toString());
        }else{
            return math.evaluate(element);
        }
    }

    if(array.length){
        let prev;
        let current;

        for(let i=0; i<array.length; i++){
            current = array[i];

            switch (current){
                case "!": {
                    output += math.factorial(parseInt(prev)).toString();
                    break;
                }
                case "+":{
                    output += "+";
                    break;
                }
                case "-":{
                    output += "-";
                    break;
                }
                case "*":{
                    output += "*";
                    break;
                }
                default:{
                    if(current instanceof Binom || current instanceof Frac){
                        current = current.getValue().toString();
                    }
                    if(array[i+1] !== "!") {
                        output += current;
                    }
                    break;
                }
            }
            prev = current;
        }
    }
    return Math.round(math.evaluate(output));
}

const radioButtons = document.querySelectorAll('input[name="resultOption"]');
radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener('change', function() {
        if (radioButton.checked) {
            switch(radioButton.value){
                case "number":{
                    document.querySelector("#inputResult").style.display = "inline";
                    document.querySelector("#binomialInput").style.display = "none";
                    document.querySelector("#fractionInput").style.display = "none";
                    document.querySelector("#fracWarning").style.display = "none";
                    break;
                }
                case "fraction":{
                    document.querySelector("#inputResult").style.display = "none";
                    document.querySelector("#binomialInput").style.display = "none";
                    document.querySelector("#fractionInput").style.display = "inline";
                    document.querySelector("#fracWarning").style.display = "flex";
                    break;
                }
                case "binom":{
                    document.querySelector("#inputResult").style.display = "none";
                    document.querySelector("#binomialInput").style.display = "inline";
                    document.querySelector("#fractionInput").style.display = "none";
                    document.querySelector("#fracWarning").style.display = "none";
                    break;
                }
            }
        }
    });
});

document.querySelector("#addResult").onclick = function (){
    let option = document.querySelector('input[name="resultOption"]:checked').value;
    let item;

    switch(option){
        case "binom": {
            let n = document.querySelector("#N").value;
            let k = document.querySelector("#K").value;
            item = new Binom(n, k);
            break;
        }
        case "fraction": {
            let top = document.querySelector("#frac1").value;
            let bottom = document.querySelector("#frac2").value;
            item = new Frac(top, bottom);
            break;
        }
        case "number": {
            item = document.querySelector("#inputResult").value;
            document.querySelector("#inputResult").value = "";
            break;
        }
    }
    result.push(item);
    displayResult();
}

document.querySelector("#result").onclick = function (){
    let correctResult = listOfTasks[currentTask - 1].result;
    if(correctResult.includes(" ")){
        correctResult = countResult(correctResult.split(" "));
    }else{
        correctResult = countResult([correctResult]);
    }
    let value = countResult(result);

    console.log(correctResult);
    console.log(value);

    document.querySelector("#unknownLabel").style.display = "none";
    document.querySelector("#incorrectLabel").style.display = "none";
    document.querySelector("#correctLabel").style.display = "none";
    if(value === correctResult && correctResult !== ""){
        document.querySelector("#correctLabel").style.display = "inline";
        saveTask(true);
        let key = currentSet.toString() + currentTask.toString();
        let values = skills.get(key);
        if(values) {
            checkSkills(values[0]).then(check =>{
                if(check){
                    updateSkills(values[0]).then(p => {
                        let html = "<i class='fa fa-trophy' style='font-size: 1.5em'></i> ";
                        html = html + values[1];
                        document.querySelector("#skillName").innerHTML = html;
                        displaySkillModal();
                    });
                }
            })
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

document.querySelector("#plus").onclick = function() {
    result.push("+");
    displayResult();
}

document.querySelector("#minus").onclick = function() {
    result.push("-");
    displayResult();
}

document.querySelector("#times").onclick = function() {
    result.push("*");
    displayResult();
}

/*document.querySelector("#pow").onclick = function() {
    result.push("^");
    displayResult();
}*/

document.querySelector("#factorialBtn").onclick = function() {
    result.push("!");
    displayResult();
}

document.querySelector("#deleteResult").onclick = function() {
    result.pop();
    displayResult();
}

export{checkSkills, updateSkills, displaySkillModal, displayResult, result, Binom, Frac}