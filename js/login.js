let logged = false

//len na check buttonu 
function changeButton(){
    switch(logged){
        case false: {
            logged = true;
            document.getElementById("login").style.display = "none";
            document.getElementById("logout").style.display = "inline";
        } break;
        case true: {
            logged = false;
            document.getElementById("login").style.display = "inline";
            document.getElementById("logout").style.display = "none";
        } break;
    }
}