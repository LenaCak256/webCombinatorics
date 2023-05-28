import * as firestore from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {auth, db} from "./config.js"

const loginButton = document.getElementById("login");
const logoutButton = document.getElementById("logout");
const signupButton = document.getElementById("signup");
const userTag = document.getElementById("userName");
const userLabel = document.getElementById("user");

const loginModal = document.getElementById("modal-login");
const signupModal = document.getElementById("modal-signup");

const setupUI = (user) => {
    if (user) {
        firestore.getDoc(firestore.doc(firestore.collection(db, 'users'), user.uid)).then((doc) => {
            userTag.textContent = doc.data().name;
        })
        // toggle user UI elements
        loginButton.style.display = "none";
        signupButton.style.display = "none";
        logoutButton.style.display = "inline";
        userLabel.style.display = "inline";
    } else {
        loginButton.style.display = "inline";
        signupButton.style.display = "inline";
        logoutButton.style.display = "none";
        userLabel.style.display = "none";
    }
};

window.onload = function () {
    // listen for auth status changes
    auth.onAuthStateChanged( user => {
        if (user) {
            //get and display data
            setupUI(user);
        } else {
            setupUI();
        }
    })
}

signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.style.display = "block";
});

//signUp
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    firebaseAuth.createUserWithEmailAndPassword(auth, email, password).then(cred => {
        return firestore.setDoc(firestore.doc(firestore.collection(db, 'users'), cred.user.uid), {
            name: signupForm['signup-name'].value
        });
    }).then(() => {
        // close the signup modal & reset form
        signupModal.style.display = "none";
        signupForm.reset();
    });
});

// logout
logoutButton.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut();
});

// login
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = "block";
});

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log the user in
    firebaseAuth.signInWithEmailAndPassword(auth, email, password).then((cred) => {
        // close the signup modal & reset form
        loginModal.style.display = "none";
        loginForm.reset();
    });
});

window.onclick = function(event) {
    if (event.target === loginModal) {
        loginModal.style.display = "none";
    } else if (event.target === signupModal) {
       signupModal.style.display = "none";
    }
}

