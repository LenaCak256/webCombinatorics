function checkResult(){
    let correctResult = listOfTasks[currentTask - 1].result.toString()
    let input = document.getElementById("searchTxt").value.toString();
    if(input !== ""){
        if(correctResult === input){
            document.getElementById("correctLabel").style.display = "block";
        }else{
            document.getElementById("incorrectLabel").style.display = "block";
        }
    }
}