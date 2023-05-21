let logged = false;

function changeButton(){
    switch(logged){
        case false: {
            logged = true;
            document.getElementById("login").style.display = "none";
            document.getElementById("logout").style.display = "inline";
            document.getElementById("user").style.display = "inline";
            document.getElementById("userName").textContent = " Lenka Čakurdová";
        } break;
        case true: {
            logged = false;
            document.getElementById("login").style.display = "inline";
            document.getElementById("logout").style.display = "none";
            document.getElementById("user").style.display = "none";
        } break;
    }
}

/*function login(){
    $.ajax({
        method: "POST",
        url: "login.php"
    })
        .done(function(msg) {
            if (msg){
                const result = JSON.parse(msg);
                logged = true;
                document.getElementById("login").style.display = "none";
                document.getElementById("logout").style.display = "inline";
                document.getElementById("user").style.display = "inline";
                document.getElementById("user").textContent = " "+result.name+" "+result.surname+"</strong>";
                clearInterval(timer);
                timer = setInterval(logout,3000);
            }
        });
}
function logout(){
    $.ajax({
        method: "POST",
        url: "logout.php"
    })
        .done(function(msg) {
            if (msg){
                clearInterval(timer);
                logged = false;
                document.getElementById("login").style.display = "inline";
                document.getElementById("logout").style.display = "none";
                document.getElementById("user").style.display = "none";
                timer = setInterval(login,3000);
            }
        });
}

timer = setInterval(login, 3000);

function googleLogin(user){

}
 */